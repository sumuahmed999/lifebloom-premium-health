/**
 * RichTextEditor Component
 * 
 * Rich text editor for blog content with formatting toolbar.
 * Currently uses a textarea - can be upgraded to TipTap or similar library.
 * 
 * Requirements: 4.10
 */

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// ============================================================================
// Types
// ============================================================================

export interface RichTextEditorProps {
  /** Current content value */
  value: string;
  /** Callback when content changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label for the editor */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Minimum height in pixels */
  minHeight?: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Rich text editor component
 * 
 * Note: This is a simplified implementation using a textarea.
 * For production, consider integrating a full-featured rich text editor like:
 * - TipTap (https://tiptap.dev/)
 * - Slate (https://www.slatejs.org/)
 * - Quill (https://quilljs.com/)
 * - Draft.js (https://draftjs.org/)
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  label = 'Content',
  required = false,
  minHeight = 300,
}: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="border rounded-lg overflow-hidden">
        {/* Formatting Toolbar Placeholder */}
        <div className="bg-muted px-3 py-2 border-b flex items-center gap-2 text-xs text-muted-foreground">
          <span>Formatting toolbar (to be implemented with rich text library)</span>
        </div>

        {/* Editor Area */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 rounded-none focus-visible:ring-0 resize-none"
          style={{ minHeight: `${minHeight}px` }}
        />
      </div>

      {/* Character Count */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          Supports Markdown formatting
        </span>
        <span>
          {value.length} characters
        </span>
      </div>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Basic Markdown formatting:</p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>**bold** for <strong>bold text</strong></li>
          <li>*italic* for <em>italic text</em></li>
          <li>[link text](url) for links</li>
          <li># Heading for headings</li>
          <li>- item for bullet lists</li>
        </ul>
      </div>
    </div>
  );
}

export default RichTextEditor;
