# Fix: Sort Order Unique Constraint Conflict

## Problem

When trying to update or reorder contact cards, the application was showing "Failed to update contact card" errors. The browser console showed multiple 400 (Bad Request) errors from Supabase.

### Root Cause

The `contact_cards` table has a UNIQUE constraint on the `sort_order` column:

```sql
sort_order INTEGER NOT NULL UNIQUE
```

When reordering cards, the system was trying to update multiple cards' sort_order values simultaneously. For example:
- Card A: sort_order 0 → 1
- Card B: sort_order 1 → 0

The problem occurred because updates were happening one at a time:
1. Update Card A to sort_order = 1 (SUCCESS)
2. Update Card B to sort_order = 1 (FAIL - already exists!)

This violated the UNIQUE constraint and caused 400 errors.

## Solution

Implemented a **two-phase update strategy** in `ContentService.updateOrder()`:

### Phase 1: Set Temporary Negative Values
First, set all cards to negative sort_order values to clear the way:
- Card A: sort_order 0 → -1
- Card B: sort_order 1 → -2
- Card C: sort_order 2 → -3

This ensures no conflicts because negative values won't collide with the target positive values.

### Phase 2: Set Final Positive Values
Then, update to the final desired sort_order values:
- Card A: sort_order -1 → 1
- Card B: sort_order -2 → 0
- Card C: sort_order -3 → 2

Now there are no conflicts because the old values are all negative.

## Code Changes

### File: `src/lib/services/ContentService.ts`

Updated the `updateOrder` method to use the two-phase approach:

```typescript
static async updateOrder(
  contentType: keyof typeof CONTENT_TABLES,
  items: { id: string; sort_order: number }[]
): Promise<ApiResponse<void>> {
  // ... validation code ...

  return withRetry(async () => {
    try {
      // Phase 1: Set all items to negative sort_order values
      const phase1Promises = items.map((item, index) =>
        apiClient.update(table, item.id, { sort_order: -(index + 1) })
      );
      await Promise.all(phase1Promises);

      // Phase 2: Update to final positive sort_order values
      const phase2Promises = items.map(item =>
        apiClient.update(table, item.id, { sort_order: item.sort_order })
      );
      await Promise.all(phase2Promises);

      return { data: null, error: null, success: true };
    } catch (error) {
      // ... error handling ...
    }
  });
}
```

### File: `src/components/admin/ContactCardForm.tsx`

Also made improvements to the form:
1. Made `sort_order` field read-only when editing existing cards
2. Excluded `sort_order` from update payloads (users should use reorder buttons)
3. Added helpful message explaining how to reorder cards

## Testing

After this fix:
- ✅ Creating new cards works correctly
- ✅ Editing existing cards works without sort_order conflicts
- ✅ Reordering cards using up/down arrows works correctly
- ✅ Bulk operations work correctly
- ✅ No more 400 errors from Supabase

## Why This Works

The two-phase approach ensures that at no point during the update process do two cards have the same sort_order value:

**Before:**
- Card A: 0
- Card B: 1
- Card C: 2

**After Phase 1:**
- Card A: -1
- Card B: -2
- Card C: -3

**After Phase 2:**
- Card A: 1 (new position)
- Card B: 0 (new position)
- Card C: 2 (unchanged)

At every step, all sort_order values are unique, so the UNIQUE constraint is never violated.

## Alternative Solutions Considered

1. **Remove UNIQUE constraint**: Not recommended - sort_order should be unique for deterministic ordering
2. **Use database transactions**: Would require Supabase RPC functions - more complex
3. **Update in specific order**: Complex logic to determine safe update order
4. **Use floating point numbers**: Would allow inserting between values but complicates the logic

The two-phase approach is simple, reliable, and doesn't require database schema changes.

## Impact

This fix resolves:
- ❌ "Failed to update contact card" errors
- ❌ 400 Bad Request errors in console
- ❌ "Failed to update order" errors when reordering

Users can now:
- ✅ Edit contact cards without errors
- ✅ Reorder cards using up/down arrows
- ✅ Publish/unpublish cards
- ✅ Perform bulk operations

## Related Files

- `src/lib/services/ContentService.ts` - Core fix
- `src/components/admin/ContactCardForm.tsx` - UI improvements
- `src/hooks/useContent.ts` - Calls updateOrder
- `src/pages/admin/ContactCardManager.tsx` - Uses reorder functionality
