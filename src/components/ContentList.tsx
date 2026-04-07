/**
 * ContentList Component
 * 
 * Generic list view for displaying and managing content items.
 * Supports search, filtering, bulk operations, and drag-and-drop reordering.
 * 
 * Requirements: 2.1, 3.1, 4.1, 5.1, 7.1, 7.2, 7.4, 8.1, 14.1, 14.4
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface ContentListColumn<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface ContentListProps<T extends { id: string; published?: boolean; category?: string }> {
  items: T[];
  columns: ContentListColumn<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  showCategoryFilter?: boolean;
  categories?: string[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onPreview?: (item: T) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkUnpublish?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
  onMoveUp?: (item: T) => void;
  onMoveDown?: (item: T) => void;
  showReordering?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ContentList<T extends { id: string; published?: boolean; category?: string }>({
  items,
  columns,
  loading = false,
  searchPlaceholder = 'Search...',
  showCategoryFilter = false,
  categories = [],
  onEdit,
  onDelete,
  onPreview,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete,
  onMoveUp,
  onMoveDown,
  showReordering = false,
}: ContentListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const itemValues = Object.values(item).join(' ').toLowerCase();
      if (!itemValues.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'published' && item.published !== true) {
        return false;
      }
      if (statusFilter === 'draft' && item.published !== false) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {showCategoryFilter && categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            {onBulkPublish && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onBulkPublish(Array.from(selectedIds));
                  clearSelection();
                }}
              >
                Publish
              </Button>
            )}
            {onBulkUnpublish && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onBulkUnpublish(Array.from(selectedIds));
                  clearSelection();
                }}
              >
                Unpublish
              </Button>
            )}
            {onBulkDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.size} items?`)) {
                    onBulkDelete(Array.from(selectedIds));
                    clearSelection();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              {columns.map(column => (
                <TableHead key={String(column.key)}>{column.label}</TableHead>
              ))}
              {showReordering && <TableHead className="w-24">Order</TableHead>}
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (showReordering ? 3 : 2)} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (showReordering ? 3 : 2)} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                    />
                  </TableCell>
                  {columns.map(column => (
                    <TableCell key={String(column.key)}>
                      {column.render ? column.render(item) : String(item[column.key as keyof T] || '')}
                    </TableCell>
                  ))}
                  {showReordering && (
                    <TableCell>
                      <div className="flex gap-1">
                        {onMoveUp && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMoveUp(item)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        )}
                        {onMoveDown && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMoveDown(item)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex gap-1">
                      {onPreview && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPreview(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Delete this item?')) {
                              onDelete(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
}

export default ContentList;
