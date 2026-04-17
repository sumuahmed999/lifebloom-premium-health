# Design Document: Dynamic Get in Touch Admin Panel

## Overview

The Dynamic Get in Touch Admin Panel feature provides a comprehensive content management system for contact cards displayed in the "Get in Touch" section of the website. This design implements a full-stack solution with database schema, admin interface, frontend display components, and security policies.

The system enables administrators to create, edit, delete, reorder, and publish contact cards through an intuitive admin interface. Each contact card supports rich content including customizable icons, color themes, detailed modal content, and call-to-action buttons with various link types (phone, email, web). The frontend displays published cards in a responsive grid layout with modal interactions for detailed information.

### Key Design Principles

1. **Separation of Concerns**: Clear boundaries between data layer (Supabase), service layer (ContentService), state management (hooks), and UI components
2. **Reusability**: Leverage existing ContentService, UI components, and patterns from the codebase
3. **Security First**: Row Level Security (RLS) policies enforce proper access control
4. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
5. **Accessibility**: WCAG-compliant components with keyboard navigation and screen reader support
6. **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Admin Components          │  Public Components             │
│  - ContactCardList         │  - ContactSection              │
│  - ContactCardForm         │  - ContactCard                 │
│  - IconPicker              │  - ContactCardModal            │
│  - ColorThemeSelector      │                                │
│  - LivePreview             │                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      State Management                        │
├─────────────────────────────────────────────────────────────┤
│  - useContactCards Hook                                      │
│  - useContent Hook (base)                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│  - ContentService (CRUD operations)                          │
│  - ValidationService (form validation)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
├─────────────────────────────────────────────────────────────┤
│  - apiClient (Supabase wrapper)                              │
│  - Retry logic & error handling                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
├─────────────────────────────────────────────────────────────┤
│  - contact_cards table                                       │
│  - RLS policies                                              │
│  - Indexes & constraints                                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Admin Operations (Create/Update/Delete)**:
1. User interacts with ContactCardForm component
2. Form validates input using ValidationService patterns
3. useContactCards hook calls ContentService methods
4. ContentService uses apiClient to communicate with Supabase
5. RLS policies verify authentication and authorization
6. Database operation executes with constraints validation
7. Response flows back through layers with error handling
8. UI updates with success/error feedback

**Public Display**:
1. ContactSection component mounts
2. useContactCards hook fetches published cards (status=true)
3. ContentService queries database with filters
4. RLS policy allows public read access to published cards
5. Cards render in responsive grid layout
6. User clicks card → ContactCardModal opens with detailed content
7. User clicks CTA button → Browser handles tel:/mailto:/https: protocol

## Components and Interfaces

### Database Schema

#### contact_cards Table

```sql
CREATE TABLE contact_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
  short_description TEXT CHECK (length(short_description) <= 200),
  detailed_content TEXT CHECK (length(detailed_content) <= 5000),
  cta_button_text TEXT,
  cta_link TEXT CHECK (cta_link ~ '^(tel:|mailto:|https:).+'),
  color_theme TEXT NOT NULL DEFAULT 'primary-blue',
  status BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Field Descriptions**:
- `id`: UUID primary key, auto-generated
- `icon`: Lucide icon name (e.g., "Phone", "Mail", "MapPin")
- `title`: Card title, 1-100 characters, required
- `short_description`: Brief description shown on card, max 200 characters
- `detailed_content`: HTML content for modal popup, max 5000 characters
- `cta_button_text`: Text for call-to-action button
- `cta_link`: Link URL with protocol validation (tel:|mailto:|https:)
- `color_theme`: One of: primary-blue, secondary-green, accent-teal, neutral-gray
- `status`: Published (true) or draft (false)
- `sort_order`: Display order, unique integer
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update, auto-updated via trigger

**Indexes**:
- `idx_contact_cards_sort_order`: Optimize ordering queries
- `idx_contact_cards_status`: Optimize published/draft filtering
- `idx_contact_cards_status_sort`: Composite index for common query pattern

**Constraints**:
- Title length: 1-100 characters (enforced at DB level)
- Short description: max 200 characters
- Detailed content: max 5000 characters
- CTA link: must match regex `^(tel:|mailto:|https:).+`
- Sort order: unique across all cards

### TypeScript Interfaces

```typescript
// Core contact card type
interface ContactCard {
  id: string;
  icon: string;
  title: string;
  short_description: string;
  detailed_content: string;
  cta_button_text: string;
  cta_link: string;
  color_theme: 'primary-blue' | 'secondary-green' | 'accent-teal' | 'neutral-gray';
  status: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Form data type (omits auto-generated fields)
type ContactCardFormData = Omit<ContactCard, 'id' | 'created_at' | 'updated_at'>;

// Validation errors
interface ContactCardValidationErrors {
  title?: string;
  short_description?: string;
  detailed_content?: string;
  cta_link?: string;
  icon?: string;
  color_theme?: string;
}

// Color theme configuration
interface ColorTheme {
  card: {
    background: string;
    border: string;
    shadow: string;
  };
  icon: {
    background: string;
    color: string;
  };
  text: {
    title: string;
    description: string;
  };
  button: {
    background: string;
    text: string;
    ring: string;
  };
}
```

### Admin Components

#### ContactCardList Component

**Purpose**: Display all contact cards with management controls

**Props**:
```typescript
interface ContactCardListProps {
  cards: ContactCard[];
  loading: boolean;
  error: Error | null;
  onEdit: (card: ContactCard) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onBulkAction: (action: BulkAction, ids: string[]) => void;
}
```

**Features**:
- Table layout with columns: Icon, Title, Description, Status, Sort Order, Actions
- Checkbox selection for bulk operations
- Action buttons: Edit, Delete, Toggle Status
- Reorder buttons: Up/Down arrows (disabled at boundaries)
- Bulk action toolbar (appears when items selected)
- Loading skeleton during fetch
- Empty state with "Create First Card" prompt
- Error state with retry button

**State Management**:
- Selected card IDs (for bulk operations)
- Select all checkbox state
- Loading states for individual operations

#### ContactCardForm Component

**Purpose**: Create and edit contact cards with live preview

**Props**:
```typescript
interface ContactCardFormProps {
  initialData?: ContactCard;
  onSubmit: (data: ContactCardFormData) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}
```

**Features**:
- Two-column layout: Form (left) + Live Preview (right)
- Icon picker with visual icon grid
- Color theme selector with color swatches
- Rich text editor for detailed content
- Real-time validation with field-specific errors
- Character counters with color coding (green → orange → red)
- Live preview updates as fields change
- Responsive: preview toggleable on mobile
- Cancel button with unsaved changes warning

**Form Fields**:
1. Icon (required): Dropdown with icon previews
2. Title (required): Text input, 1-100 chars
3. Short Description: Textarea, max 200 chars
4. Detailed Content: Rich text editor, max 5000 chars
5. CTA Button Text: Text input
6. CTA Link: Text input with protocol validation
7. Color Theme (required): Visual selector
8. Sort Order: Number input (auto-assigned for new cards)
9. Status: Toggle switch (Published/Draft)

**Validation Rules**:
- Title: Required, 1-100 characters
- Short description: Max 200 characters
- Detailed content: Max 5000 characters
- CTA link: Must match `^(tel:|mailto:|https:).+` if provided
- Icon: Required
- Color theme: Required, one of four options

#### IconPicker Component

**Purpose**: Visual icon selection interface

**Props**:
```typescript
interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  disabled?: boolean;
}
```

**Features**:
- Grid layout of available icons (4 columns on desktop, 2 on mobile)
- Icon options: Phone, Mail, MapPin, Clock, CreditCard, Heart, Users, Stethoscope
- Visual preview of each icon
- Selected icon highlighted with border and background
- Icon name displayed below each icon
- Hover effects for better UX
- Keyboard navigation support

**Icon Set**:
```typescript
const ICON_OPTIONS = [
  { value: 'Phone', label: 'Phone', icon: Phone },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Clock', label: 'Clock', icon: Clock },
  { value: 'CreditCard', label: 'Payment', icon: CreditCard },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Stethoscope', label: 'Medical', icon: Stethoscope },
];
```

#### ColorThemeSelector Component

**Purpose**: Visual color theme selection

**Props**:
```typescript
interface ColorThemeSelectorProps {
  value: ContactCardTheme;
  onChange: (theme: ContactCardTheme) => void;
  disabled?: boolean;
}
```

**Features**:
- Four theme options displayed as cards
- Each card shows: color swatch, theme name, preview
- Selected theme highlighted
- Real-time preview of icon with selected theme
- Responsive grid layout

**Theme Options**:
```typescript
const COLOR_THEME_OPTIONS = [
  { value: 'primary-blue', label: 'Primary Blue', color: 'bg-blue-500' },
  { value: 'secondary-green', label: 'Secondary Green', color: 'bg-green-500' },
  { value: 'accent-teal', label: 'Accent Teal', color: 'bg-teal-500' },
  { value: 'neutral-gray', label: 'Neutral Gray', color: 'bg-gray-500' },
];
```

#### LivePreview Component

**Purpose**: Real-time preview of contact card appearance

**Props**:
```typescript
interface LivePreviewProps {
  formData: ContactCardFormData;
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}
```

**Features**:
- Renders card exactly as it will appear on frontend
- View mode toggle: Desktop / Mobile
- Updates in real-time as form fields change
- Shows icon with selected color theme
- Displays title and short description
- Shows CTA button if configured
- Sticky positioning on desktop (stays visible while scrolling)
- Responsive container matching actual viewport sizes

### Public Components

#### ContactSection Component

**Purpose**: Display published contact cards on public website

**Features**:
- Fetches only published cards (status=true)
- Responsive grid layout:
  - Desktop (≥1024px): 2x2 grid
  - Tablet (768-1023px): 2 columns
  - Mobile (<768px): Single column
- Cards ordered by sort_order ascending
- Loading skeleton during fetch
- Empty state if no published cards
- Error state with user-friendly message
- Smooth animations on card hover

**Implementation**:
```typescript
function ContactSection() {
  const { cards, loading, error } = useContactCards({ publishedOnly: true });
  const [selectedCard, setSelectedCard] = useState<ContactCard | null>(null);

  if (loading) return <ContactSectionSkeleton />;
  if (error) return <ContactSectionError />;
  if (cards.length === 0) return <ContactSectionEmpty />;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map(card => (
            <ContactCard
              key={card.id}
              card={card}
              onClick={() => setSelectedCard(card)}
            />
          ))}
        </div>
      </div>
      
      {selectedCard && (
        <ContactCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </section>
  );
}
```

#### ContactCard Component

**Purpose**: Individual contact card display

**Props**:
```typescript
interface ContactCardProps {
  card: ContactCard;
  onClick: () => void;
}
```

**Features**:
- Icon with color theme styling
- Title and short description
- Hover effects: shadow, slight lift (-translate-y-1)
- Click to open modal
- Keyboard accessible (Enter/Space to activate)
- ARIA labels for screen readers
- Touch-friendly tap targets (min 44x44px)

**Styling**:
- Uses contactCardThemes for consistent theming
- Tailwind classes for responsive design
- Smooth transitions for hover effects
- Border and shadow effects

#### ContactCardModal Component

**Purpose**: Display detailed contact card content in modal

**Props**:
```typescript
interface ContactCardModalProps {
  card: ContactCard;
  onClose: () => void;
}
```

**Features**:
- Full-screen overlay with backdrop
- Modal dialog with card details
- Header: Icon + Title
- Body: Detailed content (rendered as HTML)
- Footer: CTA button
- Close button (X icon)
- Click outside to close
- Escape key to close
- Focus trap (keyboard navigation contained)
- Scroll lock on body when open
- Responsive sizing:
  - Mobile: 90% viewport width
  - Desktop: Max 600px width

**CTA Button Behavior**:
```typescript
function handleCTAClick(link: string) {
  if (link.startsWith('tel:')) {
    // Initiates phone call on mobile devices
    window.location.href = link;
  } else if (link.startsWith('mailto:')) {
    // Opens default email client
    window.location.href = link;
  } else if (link.startsWith('https:')) {
    // Opens in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
```

### State Management

#### useContactCards Hook

**Purpose**: Manage contact cards state and operations

**Interface**:
```typescript
interface UseContactCardsReturn {
  cards: ContactCard[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createCard: (data: ContactCardFormData) => Promise<ContactCard>;
  updateCard: (id: string, data: Partial<ContactCard>) => Promise<ContactCard>;
  deleteCard: (id: string) => Promise<void>;
  bulkPublish: (ids: string[]) => Promise<void>;
  bulkUnpublish: (ids: string[]) => Promise<void>;
  bulkDeleteCards: (ids: string[]) => Promise<void>;
  reorderCards: (cards: ContactCard[]) => Promise<void>;
}
```

**Implementation Details**:
- Wraps useContent hook with 'contact_cards' table
- Provides convenience methods for bulk operations
- Handles loading and error states
- Automatic refetch after mutations
- Optimistic updates for better UX

**Usage Example**:
```typescript
function ContactCardManager() {
  const {
    cards,
    loading,
    error,
    createCard,
    updateCard,
    deleteCard,
    bulkPublish,
  } = useContactCards();

  const handleCreate = async (data: ContactCardFormData) => {
    try {
      await createCard(data);
      toast.success('Card created successfully');
    } catch (err) {
      toast.error('Failed to create card');
    }
  };

  return <ContactCardList cards={cards} loading={loading} />;
}
```

### Service Layer Integration

#### ContentService Integration

The feature integrates with the existing ContentService class:

```typescript
// Already configured in ContentService
export const CONTENT_TABLES = {
  // ... other tables
  contact_cards: 'contact_cards',
} as const;

// Usage in components
const response = await ContentService.getAll<ContactCard>('contact_cards', {
  filters: { status: true },
  orderBy: { column: 'sort_order', ascending: true },
});
```

**Operations Supported**:
- `getAll()`: Fetch all cards with optional filters
- `getById()`: Fetch single card by ID
- `create()`: Create new card
- `update()`: Update existing card
- `delete()`: Delete card
- `bulkUpdate()`: Update multiple cards
- `bulkDelete()`: Delete multiple cards
- `updateOrder()`: Reorder cards

**Error Handling**:
- Automatic retry logic for network errors (3 retries with exponential backoff)
- Auth error detection (no retry, redirect to login)
- Validation error handling (display field-specific errors)
- Network error handling (display retry button)

#### ValidationService Integration

Form validation follows existing patterns:

```typescript
// Validation rules
const validateContactCard = (data: ContactCardFormData): ValidationResult => {
  const errors: ContactCardValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be 100 characters or less';
  }

  // Short description validation
  if (data.short_description.length > 200) {
    errors.short_description = 'Description must be 200 characters or less';
  }

  // Detailed content validation
  if (data.detailed_content.length > 5000) {
    errors.detailed_content = 'Content must be 5000 characters or less';
  }

  // CTA link validation
  if (data.cta_link && !data.cta_link.match(/^(tel:|mailto:|https:).+/)) {
    errors.cta_link = 'Link must start with tel:, mailto:, or https:';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
```

## Data Models

### Contact Card Data Model

**Entity**: ContactCard

**Attributes**:
- `id` (UUID): Unique identifier
- `icon` (string): Lucide icon name
- `title` (string): Card title, 1-100 chars
- `short_description` (string): Brief description, max 200 chars
- `detailed_content` (string): HTML content for modal, max 5000 chars
- `cta_button_text` (string): Button text
- `cta_link` (string): Link with protocol (tel:|mailto:|https:)
- `color_theme` (enum): One of four theme options
- `status` (boolean): Published or draft
- `sort_order` (integer): Display order, unique
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update time

**Relationships**:
- No foreign key relationships (standalone entity)
- Ordered by sort_order for display

**Business Rules**:
1. Title is required and must be 1-100 characters
2. Short description is optional but limited to 200 characters
3. Detailed content is optional but limited to 5000 characters
4. CTA link must follow protocol pattern if provided
5. Sort order must be unique across all cards
6. Only published cards (status=true) visible to public
7. Updated_at automatically set on every update

### Color Theme Data Model

**Entity**: ColorTheme (configuration, not stored in DB)

**Structure**:
```typescript
{
  'primary-blue': {
    card: { background, border, shadow },
    icon: { background, color },
    text: { title, description },
    button: { background, text, ring }
  },
  // ... other themes
}
```

**Usage**:
- Stored as string enum in database ('primary-blue', etc.)
- Mapped to Tailwind classes at runtime
- Consistent styling across admin and public views

### Sort Order Management

**Algorithm for Reordering**:

```typescript
// Move card up (decrease sort_order)
function moveUp(card: ContactCard, allCards: ContactCard[]) {
  const currentIndex = allCards.findIndex(c => c.id === card.id);
  if (currentIndex === 0) return; // Already first
  
  const previousCard = allCards[currentIndex - 1];
  
  // Swap sort_order values
  await ContentService.updateOrder('contact_cards', [
    { id: card.id, sort_order: previousCard.sort_order },
    { id: previousCard.id, sort_order: card.sort_order },
  ]);
}

// Move card down (increase sort_order)
function moveDown(card: ContactCard, allCards: ContactCard[]) {
  const currentIndex = allCards.findIndex(c => c.id === card.id);
  if (currentIndex === allCards.length - 1) return; // Already last
  
  const nextCard = allCards[currentIndex + 1];
  
  // Swap sort_order values
  await ContentService.updateOrder('contact_cards', [
    { id: card.id, sort_order: nextCard.sort_order },
    { id: nextCard.id, sort_order: card.sort_order },
  ]);
}
```

**Auto-Assignment for New Cards**:
```typescript
async function getNextSortOrder(): Promise<number> {
  const response = await ContentService.getAll<ContactCard>('contact_cards');
  if (!response.success || !response.data) return 0;
  
  const maxSortOrder = Math.max(...response.data.map(c => c.sort_order), -1);
  return maxSortOrder + 1;
}
```


## Error Handling

### Error Categories

#### 1. Validation Errors

**Trigger**: Invalid form input
**Handling**:
- Display field-specific error messages below inputs
- Highlight invalid fields with red border
- Prevent form submission until resolved
- Show character count in red when limit exceeded

**Example**:
```typescript
{
  title: "Title must be 100 characters or less",
  cta_link: "Link must start with tel:, mailto:, or https:"
}
```

#### 2. Network Errors

**Trigger**: Failed API requests, timeout, connection issues
**Handling**:
- Automatic retry (3 attempts with exponential backoff)
- Display error toast with retry button
- Preserve form data during retry
- Log error details for debugging

**User Message**: "Network error. Please check your connection and try again."

#### 3. Authentication Errors

**Trigger**: Expired session, invalid token, unauthorized access
**Handling**:
- No automatic retry (auth errors not transient)
- Redirect to login page
- Preserve intended action for post-login redirect
- Clear any cached auth data

**User Message**: "Your session has expired. Please log in again."

#### 4. Database Constraint Violations

**Trigger**: Unique constraint violation (duplicate sort_order), check constraint failure
**Handling**:
- Parse database error message
- Display user-friendly error
- Suggest corrective action
- For sort_order conflicts: auto-reassign and retry

**Examples**:
- Duplicate sort_order: "This position is already taken. Assigning next available position."
- Title too long: "Title must be 100 characters or less."
- Invalid CTA link: "Link must start with tel:, mailto:, or https:"

#### 5. Not Found Errors

**Trigger**: Attempting to edit/delete non-existent card
**Handling**:
- Display error message
- Refresh card list
- Remove stale references from UI

**User Message**: "This card no longer exists. The list has been refreshed."

#### 6. Concurrent Modification Errors

**Trigger**: Card modified by another user between fetch and update
**Handling**:
- Detect via updated_at timestamp comparison
- Display conflict resolution dialog
- Show current values vs. user's changes
- Allow user to choose: overwrite, merge, or cancel

**User Message**: "This card was modified by another user. Please review the changes."

### Error Handling Patterns

#### Service Layer Error Handling

```typescript
async function createCard(data: ContactCardFormData): Promise<ContactCard> {
  try {
    const response = await ContentService.create<ContactCard>('contact_cards', data);
    
    if (!response.success) {
      // Handle specific error types
      if (apiClient.isAuthError(response.error)) {
        throw new AuthError('Authentication required');
      }
      
      if (apiClient.isNetworkError(response.error)) {
        throw new NetworkError('Network request failed');
      }
      
      // Database constraint violation
      if (response.error?.code === 'UNIQUE_VIOLATION') {
        // Auto-reassign sort_order and retry
        const nextSortOrder = await getNextSortOrder();
        data.sort_order = nextSortOrder;
        return createCard(data); // Recursive retry
      }
      
      throw new Error(response.error?.message || 'Failed to create card');
    }
    
    return response.data;
  } catch (error) {
    // Log error for debugging
    console.error('Create card error:', error);
    
    // Re-throw for component handling
    throw error;
  }
}
```

#### Component Error Handling

```typescript
function ContactCardForm({ onSubmit }: ContactCardFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ContactCardFormData) => {
    setError(null);
    setSubmitting(true);
    
    try {
      await onSubmit(data);
      toast.success('Card saved successfully');
    } catch (err) {
      if (err instanceof AuthError) {
        // Redirect to login
        navigate('/login', { state: { returnTo: location.pathname } });
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Loading States

#### 1. Initial Data Load

**State**: Fetching cards from database
**UI**: Skeleton loaders matching card layout
**Duration**: Typically 200-500ms

```typescript
function ContactSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="p-6">
          <Skeleton className="w-12 h-12 rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      ))}
    </div>
  );
}
```

#### 2. Form Submission

**State**: Creating/updating card
**UI**: 
- Disable submit button
- Show loading spinner on button
- Disable all form inputs
- Display "Saving..." text

**Duration**: Typically 300-800ms

#### 3. Delete Operation

**State**: Deleting card
**UI**:
- Disable action buttons on card
- Show loading spinner on delete button
- Fade out card opacity
- Remove card from list on success

#### 4. Bulk Operations

**State**: Processing multiple cards
**UI**:
- Progress indicator showing X of Y completed
- Disable bulk action buttons
- Show loading spinner
- Display success count on completion

#### 5. Reorder Operation

**State**: Updating sort_order
**UI**:
- Disable reorder buttons
- Show loading spinner on clicked button
- Optimistic update (move card immediately)
- Revert on error

### User Feedback

#### Success Messages (Toast Notifications)

- "Card created successfully"
- "Card updated successfully"
- "Card deleted successfully"
- "X cards published"
- "X cards unpublished"
- "X cards deleted"
- "Cards reordered successfully"

#### Error Messages (Toast Notifications)

- "Failed to create card. Please try again."
- "Failed to update card. Please try again."
- "Failed to delete card. Please try again."
- "Failed to load cards. Please refresh the page."
- "Network error. Please check your connection."
- "You don't have permission to perform this action."

#### Confirmation Dialogs

**Delete Single Card**:
```
Title: Delete Contact Card?
Message: Are you sure you want to delete "[Card Title]"? This action cannot be undone.
Actions: Cancel | Delete
```

**Bulk Delete**:
```
Title: Delete Multiple Cards?
Message: Are you sure you want to delete X selected cards? This action cannot be undone.
Actions: Cancel | Delete All
```

**Unsaved Changes**:
```
Title: Unsaved Changes
Message: You have unsaved changes. Are you sure you want to leave?
Actions: Stay | Leave
```

## RLS Policies

### Policy Overview

Row Level Security (RLS) policies control access to the contact_cards table based on user authentication status.

### Policy Definitions

#### 1. Public Read Access (Published Cards)

```sql
CREATE POLICY "Public can view published cards"
  ON contact_cards FOR SELECT
  USING (status = true);
```

**Purpose**: Allow unauthenticated users to view published cards
**Scope**: SELECT operations only
**Condition**: status = true
**Use Case**: Public website display

#### 2. Admin Read Access (All Cards)

```sql
CREATE POLICY "Authenticated users can view all cards"
  ON contact_cards FOR SELECT
  TO authenticated
  USING (true);
```

**Purpose**: Allow authenticated admins to view all cards (published and drafts)
**Scope**: SELECT operations
**Condition**: User must be authenticated
**Use Case**: Admin panel card list

#### 3. Admin Create Access

```sql
CREATE POLICY "Authenticated users can insert cards"
  ON contact_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

**Purpose**: Allow authenticated admins to create new cards
**Scope**: INSERT operations
**Condition**: User must be authenticated
**Use Case**: Admin panel card creation

#### 4. Admin Update Access

```sql
CREATE POLICY "Authenticated users can update cards"
  ON contact_cards FOR UPDATE
  TO authenticated
  USING (true);
```

**Purpose**: Allow authenticated admins to update existing cards
**Scope**: UPDATE operations
**Condition**: User must be authenticated
**Use Case**: Admin panel card editing

#### 5. Admin Delete Access

```sql
CREATE POLICY "Authenticated users can delete cards"
  ON contact_cards FOR DELETE
  TO authenticated
  USING (true);
```

**Purpose**: Allow authenticated admins to delete cards
**Scope**: DELETE operations
**Condition**: User must be authenticated
**Use Case**: Admin panel card deletion

### Security Considerations

#### Authentication Flow

1. User logs in via Supabase Auth
2. JWT token issued with user ID and role
3. Token included in all API requests
4. RLS policies evaluate token claims
5. Operations allowed/denied based on policies

#### Authorization Levels

**Public (Unauthenticated)**:
- ✅ View published cards (status=true)
- ❌ View draft cards
- ❌ Create cards
- ❌ Update cards
- ❌ Delete cards

**Admin (Authenticated)**:
- ✅ View all cards (published and drafts)
- ✅ Create cards
- ✅ Update cards
- ✅ Delete cards
- ✅ Bulk operations

#### Data Validation

**Database Level**:
- CHECK constraints enforce data integrity
- UNIQUE constraint on sort_order
- NOT NULL constraints on required fields
- Regex validation on cta_link

**Application Level**:
- Form validation before submission
- Type checking via TypeScript
- Sanitization of HTML content
- XSS prevention in rich text editor

#### Audit Trail

**Automatic Timestamps**:
- `created_at`: Set on INSERT
- `updated_at`: Auto-updated via trigger on UPDATE

**Future Enhancement** (not in current scope):
- Add `created_by` and `updated_by` fields
- Track which admin performed each operation
- Implement audit log table for compliance

## Responsive Design

### Breakpoint Strategy

```typescript
const breakpoints = {
  mobile: '< 768px',
  tablet: '768px - 1023px',
  desktop: '≥ 1024px',
};
```

### Layout Adaptations

#### Admin Panel

**Desktop (≥1024px)**:
- Two-column layout: Form (60%) + Preview (40%)
- Table layout for card list
- All columns visible
- Inline action buttons

**Tablet (768-1023px)**:
- Single column layout
- Preview below form
- Table layout with fewer columns
- Dropdown menu for actions

**Mobile (<768px)**:
- Single column layout
- Preview toggleable (hidden by default)
- Card layout instead of table
- Stacked action buttons

#### Public Display

**Desktop (≥1024px)**:
- 2x2 grid layout
- Cards: 400px width
- 24px gap between cards
- Modal: 600px max width

**Tablet (768-1023px)**:
- 2-column grid
- Cards: flexible width
- 20px gap between cards
- Modal: 90% viewport width

**Mobile (<768px)**:
- Single column
- Cards: full width
- 16px gap between cards
- Modal: 95% viewport width, full height

### Touch Targets

**Minimum Size**: 44x44 pixels (WCAG 2.1 Level AAA)

**Interactive Elements**:
- Buttons: min 44px height
- Card click area: entire card surface
- Checkbox: 24x24px with 44x44px touch area
- Icon buttons: 40x40px minimum

### Typography Scaling

```css
/* Mobile */
.card-title { font-size: 1.125rem; /* 18px */ }
.card-description { font-size: 0.875rem; /* 14px */ }

/* Tablet */
@media (min-width: 768px) {
  .card-title { font-size: 1.25rem; /* 20px */ }
  .card-description { font-size: 0.9375rem; /* 15px */ }
}

/* Desktop */
@media (min-width: 1024px) {
  .card-title { font-size: 1.5rem; /* 24px */ }
  .card-description { font-size: 1rem; /* 16px */ }
}
```

### Image and Icon Scaling

**Icons**:
- Mobile: 20px (w-5 h-5)
- Tablet: 24px (w-6 h-6)
- Desktop: 24px (w-6 h-6)

**Icon Containers**:
- Mobile: 40px (w-10 h-10)
- Tablet: 48px (w-12 h-12)
- Desktop: 48px (w-12 h-12)

### Modal Behavior

**Desktop**:
- Centered on screen
- Max width: 600px
- Backdrop blur effect
- Smooth fade-in animation

**Mobile**:
- Full screen or near-full screen
- Slide-up animation
- No backdrop blur (performance)
- Swipe-down to close gesture

### Performance Considerations

**Mobile Optimizations**:
- Lazy load modal content
- Reduce animation complexity
- Minimize re-renders
- Use CSS transforms for animations (GPU-accelerated)
- Debounce scroll events

**Image Optimization**:
- Serve appropriately sized images
- Use WebP format with fallbacks
- Lazy load images below fold
- Implement progressive loading

## Testing Strategy

### Unit Testing

**Target**: Individual functions and components in isolation

**Tools**:
- Jest: Test runner and assertion library
- React Testing Library: Component testing
- MSW (Mock Service Worker): API mocking

**Test Coverage**:

1. **Validation Functions**
   - Test each validation rule independently
   - Test edge cases (empty strings, max length, boundary values)
   - Test regex patterns for CTA links
   - Example: Title validation with 0, 1, 100, 101 characters

2. **Component Rendering**
   - Test component renders without errors
   - Test props are correctly applied
   - Test conditional rendering (loading, error, empty states)
   - Test accessibility attributes (ARIA labels, roles)

3. **Event Handlers**
   - Test button clicks trigger correct callbacks
   - Test form submission with valid/invalid data
   - Test keyboard navigation (Enter, Escape, Tab)
   - Test modal open/close behavior

4. **State Management**
   - Test hook returns correct initial state
   - Test state updates after operations
   - Test error state handling
   - Test loading state transitions

**Example Unit Tests**:

```typescript
describe('ContactCard Validation', () => {
  it('should reject empty title', () => {
    const result = validateContactCard({ title: '', /* ... */ });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe('Title is required');
  });

  it('should reject title over 100 characters', () => {
    const longTitle = 'a'.repeat(101);
    const result = validateContactCard({ title: longTitle, /* ... */ });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe('Title must be 100 characters or less');
  });

  it('should accept valid tel: link', () => {
    const result = validateContactCard({ cta_link: 'tel:+1234567890', /* ... */ });
    expect(result.errors.cta_link).toBeUndefined();
  });

  it('should reject invalid link protocol', () => {
    const result = validateContactCard({ cta_link: 'http://example.com', /* ... */ });
    expect(result.errors.cta_link).toBe('Link must start with tel:, mailto:, or https:');
  });
});

describe('ContactCard Component', () => {
  it('should render card with correct title', () => {
    const card = { title: 'Test Card', /* ... */ };
    render(<ContactCard card={card} onClick={jest.fn()} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const onClick = jest.fn();
    const card = { title: 'Test Card', /* ... */ };
    render(<ContactCard card={card} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be keyboard accessible', () => {
    const onClick = jest.fn();
    const card = { title: 'Test Card', /* ... */ };
    render(<ContactCard card={card} onClick={onClick} />);
    const cardElement = screen.getByRole('button');
    fireEvent.keyDown(cardElement, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Property-Based Testing

**Target**: Universal properties that should hold for all valid inputs

**Tools**:
- fast-check: Property-based testing library for TypeScript
- Integrated with Jest

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: dynamic-get-in-touch-admin, Property X: [property description]`

**Property Test Patterns**:

1. **Invariant Properties**: Properties that remain constant after operations
2. **Round-trip Properties**: Operations that should be reversible
3. **Idempotence Properties**: Operations that produce same result when repeated
4. **Metamorphic Properties**: Relationships between inputs and outputs
5. **Error Condition Properties**: Invalid inputs should be rejected consistently

**Note**: Specific correctness properties will be defined in the Correctness Properties section below, derived from the requirements acceptance criteria.

### Integration Testing

**Target**: Component interactions and data flow

**Scope**:
- Form submission → Service layer → Database
- Card list → Edit form → Update → Refresh list
- Bulk operations → Multiple database updates
- Modal open → CTA click → External navigation

**Test Scenarios**:

1. **Create Card Flow**
   - Fill form with valid data
   - Submit form
   - Verify card appears in list
   - Verify database contains new card

2. **Edit Card Flow**
   - Click edit on existing card
   - Modify fields
   - Submit form
   - Verify changes reflected in list
   - Verify database updated

3. **Delete Card Flow**
   - Click delete on card
   - Confirm deletion
   - Verify card removed from list
   - Verify database no longer contains card

4. **Reorder Cards Flow**
   - Click up/down arrow
   - Verify visual order changes
   - Verify sort_order values updated in database
   - Verify order persists after refresh

5. **Bulk Operations Flow**
   - Select multiple cards
   - Trigger bulk action (publish/unpublish/delete)
   - Verify all selected cards affected
   - Verify database reflects changes

### End-to-End Testing

**Target**: Complete user workflows across the application

**Tools**:
- Playwright or Cypress
- Real browser automation
- Real database (test environment)

**Test Scenarios**:

1. **Admin Creates and Publishes Card**
   - Login as admin
   - Navigate to contact cards page
   - Click "Create Card"
   - Fill all fields
   - Toggle status to published
   - Submit form
   - Verify success message
   - Navigate to public website
   - Verify card appears

2. **Public User Views Card Details**
   - Navigate to public website
   - Locate contact card
   - Click card
   - Verify modal opens
   - Verify detailed content displayed
   - Click CTA button
   - Verify correct action (tel:/mailto:/https:)

3. **Admin Reorders Cards**
   - Login as admin
   - Navigate to contact cards page
   - Note current order
   - Click reorder button
   - Verify visual order changes
   - Refresh page
   - Verify order persists
   - Navigate to public website
   - Verify public display matches new order

### Accessibility Testing

**Tools**:
- axe-core: Automated accessibility testing
- NVDA/JAWS: Screen reader testing
- Keyboard-only navigation testing

**Test Coverage**:
- All interactive elements keyboard accessible
- Proper ARIA labels and roles
- Focus management in modals
- Color contrast ratios meet WCAG AA
- Touch targets meet minimum size requirements
- Form errors announced to screen readers

### Performance Testing

**Metrics**:
- Initial page load: < 2 seconds
- Card list render: < 500ms
- Form submission: < 1 second
- Modal open animation: < 300ms

**Tools**:
- Lighthouse: Performance audits
- Chrome DevTools: Performance profiling
- React DevTools: Component render profiling

**Test Scenarios**:
- Load page with 20+ cards
- Rapid form field changes (live preview)
- Bulk operations on 10+ cards
- Modal open/close repeatedly


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Field Persistence**: Requirements 1.1, 4.1, and 4.2 all relate to ensuring fields are correctly stored and retrieved. These can be combined into a single round-trip property.

2. **Validation Rules**: Requirements 1.2, 1.3, 1.4, and 1.5 are all validation rules that can be tested together as a comprehensive validation property, though each specific rule should also be tested individually for clarity.

3. **Ordering**: Requirements 2.1 and 8.3 both test that cards appear in sort_order ascending. These are the same property applied in different contexts (admin vs public).

4. **Display Fields**: Requirements 2.2, 8.6, 9.2, 9.4, 17.3, and 17.4 all relate to ensuring specific fields are displayed. These can be consolidated into properties about complete data display.

5. **Bulk Operations**: Requirements 7.5 and 7.6 are similar bulk update operations that can be generalized into a single property about bulk status updates.

6. **Protocol Handling**: Requirements 9.6, 9.7, and 9.8 all test CTA link protocol handling and can be combined into a single property about correct protocol routing.

7. **Live Preview Updates**: Requirements 17.2, 17.6, and 17.7 all test that the preview updates reactively and can be combined into a single property about preview synchronization.

8. **RLS Policies**: Requirements 12.1-12.6 test different aspects of RLS but can be grouped into properties about authenticated vs unauthenticated access.

### Core Properties

#### Property 1: Contact Card Round-Trip Persistence

*For any* valid contact card with all fields populated (icon, title, short_description, detailed_content, cta_button_text, cta_link, color_theme, status, sort_order), creating the card and then fetching it back should return a card with all fields matching the original values.

**Validates: Requirements 1.1, 4.1, 4.2**

**Rationale**: This is a round-trip property that ensures data integrity through the full create-read cycle. It verifies that all fields are correctly persisted to the database and retrieved without loss or corruption.

#### Property 2: Title Length Validation

*For any* string, if its length is less than 1 or greater than 100 characters, attempting to create or update a contact card with that string as the title should be rejected with a validation error.

**Validates: Requirements 1.2**

**Rationale**: This validates the title length constraint at the application level. The database also enforces this constraint, providing defense in depth.

#### Property 3: Short Description Length Validation

*For any* string with length greater than 200 characters, attempting to create or update a contact card with that string as the short_description should be rejected with a validation error.

**Validates: Requirements 1.3**

**Rationale**: This validates the short_description length constraint to ensure cards display properly without truncation issues.

#### Property 4: Detailed Content Length Validation

*For any* string with length greater than 5000 characters, attempting to create or update a contact card with that string as the detailed_content should be rejected with a validation error.

**Validates: Requirements 1.4**

**Rationale**: This validates the detailed_content length constraint to prevent excessively large modal content that could impact performance.

#### Property 5: CTA Link Protocol Validation

*For any* string that does not match the pattern `^(tel:|mailto:|https:).+`, attempting to create or update a contact card with that string as the cta_link should be rejected with a validation error.

**Validates: Requirements 1.5**

**Rationale**: This ensures only valid link protocols are accepted, preventing broken links and security issues from unsupported protocols.

#### Property 6: Sort Order Uniqueness

*For any* two contact cards, they cannot have the same sort_order value. Attempting to create or update a card with a sort_order that already exists should either be rejected or automatically reassigned to the next available value.

**Validates: Requirements 1.6**

**Rationale**: This enforces the uniqueness constraint on sort_order, which is essential for deterministic ordering of cards.

#### Property 7: Automatic Timestamp Updates

*For any* contact card, when it is created or updated, the updated_at timestamp should be set to the current time (within a reasonable tolerance of a few seconds).

**Validates: Requirements 1.7**

**Rationale**: This verifies the database trigger correctly maintains the updated_at timestamp, which is important for audit trails and cache invalidation.

#### Property 8: Color Theme Validation

*For any* contact card, the color_theme field must be one of: 'primary-blue', 'secondary-green', 'accent-teal', or 'neutral-gray'. Attempting to create or update a card with any other value should be rejected.

**Validates: Requirements 1.8**

**Rationale**: This ensures only valid color themes are used, preventing rendering errors from undefined theme configurations.

#### Property 9: Card List Ordering

*For any* set of contact cards, when displayed in the admin panel or public website, they should appear in ascending order by sort_order value.

**Validates: Requirements 2.1, 8.3**

**Rationale**: This ensures consistent ordering across all views, making the sort_order field meaningful and predictable.

#### Property 10: Admin Display Completeness

*For any* contact card displayed in the admin panel list, the rendered output should contain the card's icon, title, short_description, status indicator, and sort_order value.

**Validates: Requirements 2.2**

**Rationale**: This ensures administrators have all necessary information to manage cards effectively without needing to open each card for details.

#### Property 11: Published Card Filtering

*For any* set of contact cards, when displayed on the public website, only cards where status equals true should appear.

**Validates: Requirements 8.4**

**Rationale**: This ensures draft cards remain hidden from public view, allowing administrators to prepare content before publishing.

#### Property 12: Color Theme Application

*For any* contact card with a color_theme value, when rendered on the frontend, the card's icon, background, border, and text should use the CSS classes defined for that theme in contactCardThemes.

**Validates: Requirements 8.5**

**Rationale**: This ensures visual consistency and correct theme application across all cards.

#### Property 13: Public Display Completeness

*For any* contact card displayed on the public website, the rendered output should contain the card's icon, title, and short_description.

**Validates: Requirements 8.6**

**Rationale**: This ensures visitors see all essential information needed to decide whether to click for more details.

#### Property 14: Next Sort Order Assignment

*For any* existing set of contact cards, when creating a new card without specifying sort_order, the system should automatically assign a sort_order value equal to the maximum existing sort_order plus one (or 0 if no cards exist).

**Validates: Requirements 3.6**

**Rationale**: This ensures new cards are automatically placed at the end of the list without manual sort_order management.

#### Property 15: Create Operation Success

*For any* valid contact card data (passing all validation rules), submitting the create form should result in a new card appearing in the database and the admin panel list with all fields matching the submitted data.

**Validates: Requirements 3.7**

**Rationale**: This is an end-to-end property verifying the complete create workflow from form submission to database persistence to UI refresh.

#### Property 16: Validation Error Display

*For any* invalid contact card data (failing one or more validation rules), submitting the create or edit form should display field-specific error messages for each invalid field without creating or updating the card.

**Validates: Requirements 3.8, 4.5, 16.6**

**Rationale**: This ensures users receive clear, actionable feedback about what needs to be corrected, improving the user experience.

#### Property 17: Partial Update Preservation

*For any* existing contact card, when updating only a subset of fields, all non-updated fields should retain their original values.

**Validates: Requirements 4.3, 4.4**

**Rationale**: This ensures partial updates work correctly without inadvertently clearing or modifying unrelated fields.

#### Property 18: Delete Operation Success

*For any* existing contact card, when an administrator confirms deletion, the card should be removed from the database and no longer appear in any queries.

**Validates: Requirements 5.3**

**Rationale**: This verifies the delete operation completely removes the card, preventing orphaned or partially deleted records.

#### Property 19: Reorder Up Operation

*For any* contact card that is not first in the list (sort_order > minimum), clicking the up arrow should swap its sort_order with the previous card's sort_order, resulting in the card moving up one position in the list.

**Validates: Requirements 6.2**

**Rationale**: This ensures the reorder up operation correctly swaps positions without affecting other cards or creating duplicate sort_order values.

#### Property 20: Reorder Down Operation

*For any* contact card that is not last in the list (sort_order < maximum), clicking the down arrow should swap its sort_order with the next card's sort_order, resulting in the card moving down one position in the list.

**Validates: Requirements 6.3**

**Rationale**: This ensures the reorder down operation correctly swaps positions without affecting other cards or creating duplicate sort_order values.

#### Property 21: Bulk Status Update

*For any* set of selected contact cards, triggering bulk publish should set status=true for all selected cards, and triggering bulk unpublish should set status=false for all selected cards.

**Validates: Requirements 7.5, 7.6**

**Rationale**: This ensures bulk operations correctly update all selected cards atomically, without partial failures leaving the system in an inconsistent state.

#### Property 22: Modal Content Display

*For any* contact card, when a visitor clicks the card, the opened modal should display the card's icon, title, detailed_content (rendered as HTML), and CTA button with cta_button_text.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

**Rationale**: This ensures the modal displays complete information, providing visitors with all details they need to take action.

#### Property 23: CTA Link Protocol Routing

*For any* contact card with a cta_link, clicking the CTA button should trigger the appropriate action based on the protocol: tel: links should initiate phone calls, mailto: links should open email clients, and https: links should open in new browser tabs.

**Validates: Requirements 9.6, 9.7, 9.8**

**Rationale**: This ensures the CTA button correctly handles different link types, providing the expected user experience for each protocol.

#### Property 24: Live Preview Synchronization

*For any* form field change (icon, title, short_description, color_theme) in the create/edit form, the live preview should update within 100ms to reflect the new value with correct styling.

**Validates: Requirements 17.2, 17.3, 17.4, 17.6, 17.7**

**Rationale**: This ensures the live preview provides real-time feedback, allowing administrators to see exactly how their changes will appear before saving.

#### Property 25: Public Read Access (RLS)

*For any* unauthenticated user, querying the contact_cards table should return only cards where status=true, and attempting to create, update, or delete cards should be denied.

**Validates: Requirements 12.1, 12.6**

**Rationale**: This verifies the RLS policies correctly restrict public access to read-only operations on published cards, preventing unauthorized modifications.

#### Property 26: Admin Full Access (RLS)

*For any* authenticated administrator, querying the contact_cards table should return all cards regardless of status, and create, update, and delete operations should succeed (subject to validation rules).

**Validates: Requirements 12.2, 12.3, 12.4, 12.5**

**Rationale**: This verifies the RLS policies correctly grant full access to authenticated administrators, enabling complete content management.

### Edge Case Properties

These properties test boundary conditions and special states that are important but don't apply to all inputs.

#### Edge Case 1: Empty Card List

When no contact cards exist in the database, the admin panel should display an empty state message prompting the administrator to create the first card, and the public website should display a fallback message.

**Validates: Requirements 2.5, 8.7**

#### Edge Case 2: Reorder Boundary Conditions

The up arrow button should be disabled for the card with the minimum sort_order (first card), and the down arrow button should be disabled for the card with the maximum sort_order (last card).

**Validates: Requirements 6.4, 6.5**

#### Edge Case 3: Icon Picker Initial State

When the icon picker is first displayed with no icon selected, it should show a placeholder message indicating no icon is selected.

**Validates: Requirements 10.6**

### Example-Based Tests

These tests verify specific scenarios or UI interactions that are better suited to example-based testing than property-based testing.

#### Example 1: Admin Panel Navigation

The admin panel should include a navigation link to /admin/contact-cards that displays the contact card management page when clicked.

**Validates: Requirements 13.3**

#### Example 2: Form UI Components

The create/edit form should include all required UI components: input fields for title, short_description, detailed_content, cta_button_text, and cta_link; an icon picker; a color theme selector; a status toggle; and cancel/submit buttons.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.9, 4.6**

#### Example 3: Action Buttons

Each card in the admin panel list should have edit, delete, and status toggle action buttons.

**Validates: Requirements 2.3**

#### Example 4: Loading States

The system should display appropriate loading indicators during data fetch (skeleton loaders), form submission (disabled button with spinner), and delete operations (spinner on delete button).

**Validates: Requirements 2.6, 8.8, 16.1, 16.2, 16.3, 16.4**

#### Example 5: Error States

The system should display appropriate error messages with retry options for network errors, field-specific errors for validation failures, and redirect to login for authentication errors.

**Validates: Requirements 2.7, 8.9, 16.5, 16.7**

#### Example 6: Confirmation Dialogs

Delete operations should display confirmation dialogs showing the card title (for single delete) or count (for bulk delete) before proceeding.

**Validates: Requirements 5.1, 5.2, 5.5, 7.7**

#### Example 7: Bulk Operations UI

The admin panel should provide checkboxes for card selection, a "select all" checkbox, and a bulk actions toolbar that appears when cards are selected, offering publish, unpublish, and delete actions.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

#### Example 8: Modal Interactions

The modal should provide a close button and close when clicking outside the modal or pressing Escape.

**Validates: Requirements 9.9, 9.10**

#### Example 9: Icon Picker Interactions

The icon picker should display a grid of 8 contact-related icons, highlight the selected icon, and display the selected icon name.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

#### Example 10: Color Theme Selector

The color theme selector should display all four theme options with visual color swatches, highlight the selected theme, and default to primary-blue for new cards.

**Validates: Requirements 11.1, 11.2, 11.3, 11.5**

#### Example 11: Responsive Layouts

The system should display cards in a 2x2 grid on desktop (≥1024px), 2 columns on tablet (768-1023px), and single column on mobile (<768px). Modals should be 600px max width on desktop and 90% width on mobile. Touch targets should be at least 44x44px on mobile.

**Validates: Requirements 8.1, 8.2, 15.1, 15.2, 15.3, 15.5, 15.6, 15.7**

#### Example 12: Success Notifications

The system should display success toast notifications when operations complete successfully.

**Validates: Requirements 16.8**

#### Example 13: Seed Data

Running the seed script should create exactly four contact cards with specific properties: "Call Us" (Phone icon, primary-blue, tel: link), "Email Us" (Mail icon, secondary-green, mailto: link), "Visit Us" (MapPin icon, accent-teal, https: link), and "Opening Hours" (Clock icon, neutral-gray, https: link), all published with sort_order values 0, 1, 2, 3.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7**

#### Example 14: Live Preview Panel

The create/edit form should display a live preview panel showing how the card will appear on the frontend.

**Validates: Requirements 17.1**

### Property Test Implementation Notes

**Test Configuration**:
- Use fast-check library for property-based testing in TypeScript
- Run minimum 100 iterations per property test
- Tag each test with: `Feature: dynamic-get-in-touch-admin, Property X: [property description]`

**Generator Strategies**:
- **Valid Contact Cards**: Generate cards with all required fields, valid lengths, valid protocols, valid themes
- **Invalid Titles**: Generate strings with length 0, 101, 1000 to test validation
- **Invalid Descriptions**: Generate strings with length 201, 5001 to test validation
- **Invalid Links**: Generate strings without protocols, with http:, with ftp:, etc.
- **Invalid Themes**: Generate strings not in the theme enum
- **Sort Orders**: Generate unique integers, duplicate integers, negative integers
- **Status Values**: Generate true, false, and invalid values
- **HTML Content**: Generate valid HTML, malicious HTML (for XSS testing), empty HTML

**Shrinking Strategy**:
When a property test fails, fast-check will automatically shrink the failing input to the minimal example. For contact cards, this typically means:
- Reducing string lengths to minimum failing length
- Simplifying HTML to minimal failing structure
- Reducing sort_order to smallest failing value

**Example Property Test**:

```typescript
import fc from 'fast-check';

// Feature: dynamic-get-in-touch-admin, Property 2: Title Length Validation
describe('Property 2: Title Length Validation', () => {
  it('should reject titles with length < 1 or > 100', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''), // length 0
          fc.string({ minLength: 101, maxLength: 200 }) // length > 100
        ),
        async (invalidTitle) => {
          const cardData = {
            ...validCardDefaults,
            title: invalidTitle,
          };
          
          const result = await createCard(cardData);
          
          expect(result.success).toBe(false);
          expect(result.error).toContain('title');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

