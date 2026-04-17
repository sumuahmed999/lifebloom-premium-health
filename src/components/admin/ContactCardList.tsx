/**
 * ContactCardList Component
 * 
 * Displays contact cards in admin interface with grid/table view,
 * search/filter, bulk operations, and reordering controls.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import {
  Search,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  CreditCard,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { ContactCard } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface ContactCardListProps {
  cards: ContactCard[];
  loading?: boolean;
  onEdit: (card: ContactCard) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
  onMoveUp: (card: ContactCard) => void;
  onMoveDown: (card: ContactCard) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkUnpublish?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

// ============================================================================
// Component
// ============================================================================

export function ContactCardList({
  cards,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete,
}: ContactCardListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sort cards by sort_order
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => a.sort_order - b.sort_order);
  }, [cards]);

  // Filter cards based on search and status
  const filteredCards = useMemo(() => {
    return sortedCards.filter(card => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = card.title.toLowerCase().includes(searchLower);
        const descMatch = card.short_description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'published' && !card.status) {
          return false;
        }
        if (statusFilter === 'draft' && card.status) {
          return false;
        }
      }

      return true;
    });
  }, [sortedCards, searchTerm, statusFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCards.map(card => card.id)));
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
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />;
  };

  // Check if move up/down should be disabled
  const canMoveUp = (card: ContactCard) => {
    const index = sortedCards.findIndex(c => c.id === card.id);
    return index > 0;
  };

  const canMoveDown = (card: ContactCard) => {
    const index = sortedCards.findIndex(c => c.id === card.id);
    return index < sortedCards.length - 1;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
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
            {selectedIds.size} card{selectedIds.size > 1 ? 's' : ''} selected
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
                  if (confirm(`Delete ${selectedIds.size} card${selectedIds.size > 1 ? 's' : ''}?`)) {
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
                  checked={selectedIds.size === filteredCards.length && filteredCards.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-24">Order</TableHead>
              <TableHead className="w-32">Reorder</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-12 w-12 opacity-50" />
                    <p className="text-lg font-medium">No contact cards found</p>
                    {hasActiveFilters ? (
                      <p className="text-sm">Try adjusting your filters</p>
                    ) : (
                      <p className="text-sm">Click "Add Card" to create your first contact card</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow 
                  key={card.id}
                  className={!card.status ? 'opacity-60' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(card.id)}
                      onCheckedChange={() => toggleSelect(card.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getIconComponent(card.icon)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{card.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {card.short_description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={card.status ? 'default' : 'secondary'}>
                      {card.status ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {card.sort_order}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMoveUp(card)}
                        disabled={!canMoveUp(card)}
                        title="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMoveDown(card)}
                        disabled={!canMoveDown(card)}
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(card)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Delete this contact card?')) {
                            onDelete(card.id);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
        Showing {filteredCards.length} of {cards.length} card{cards.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default ContactCardList;
