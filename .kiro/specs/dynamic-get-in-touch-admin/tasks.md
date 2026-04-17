# Implementation Plan: Dynamic Get in Touch Admin Panel

## Overview

This implementation plan converts the approved design into actionable coding tasks for the Dynamic Get in Touch Admin Panel feature. The feature enables administrators to manage contact cards through a full-featured admin interface with create, edit, delete, reorder, and bulk operations capabilities. The public-facing component displays published cards in a responsive grid with modal interactions.

The implementation follows an incremental approach: database setup → service layer → state management → admin components → public components → integration → testing. Each task builds on previous work, ensuring the system remains functional at every step.

## Tasks

- [x] 1. Database schema and RLS policies setup
  - Create contact_cards table with all fields and constraints
  - Add indexes for sort_order, status, and composite status+sort_order
  - Create RLS policies for public read access (published cards only)
  - Create RLS policies for authenticated admin access (full CRUD)
  - Create updated_at trigger for automatic timestamp updates
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ]* 1.1 Write property test for database constraints
  - **Property 2: Title Length Validation**
  - **Property 3: Short Description Length Validation**
  - **Property 4: Detailed Content Length Validation**
  - **Property 5: CTA Link Protocol Validation**
  - **Property 6: Sort Order Uniqueness**
  - **Property 8: Color Theme Validation**
  - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 1.8**

- [ ] 2. TypeScript types and interfaces
  - [x] 2.1 Create ContactCard interface in src/types/admin-content.ts
    - Define all fields matching database schema
    - Create ContactCardFormData type (omit auto-generated fields)
    - Create ContactCardValidationErrors interface
    - Create ColorTheme type and configuration interface
    - _Requirements: 1.1, 1.8_

  - [x] 2.2 Create color theme configuration in src/lib/themes/
    - Define contactCardThemes object with all four themes
    - Map theme names to Tailwind CSS classes
    - Export theme utilities for component usage
    - _Requirements: 1.8, 11.1, 11.2_

- [ ] 3. Service layer integration
  - [x] 3.1 Add contact_cards to ContentService CONTENT_TABLES
    - Update CONTENT_TABLES constant in ContentService.ts
    - Verify ContentService methods work with contact_cards table
    - _Requirements: 13.1_

  - [x] 3.2 Create validation functions in ValidationService
    - Implement validateContactCard function with all validation rules
    - Add helper functions for title, description, content, and link validation
    - Export validation utilities
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 3.8, 4.5_

  - [ ]* 3.3 Write property tests for validation functions
    - **Property 2: Title Length Validation**
    - **Property 3: Short Description Length Validation**
    - **Property 4: Detailed Content Length Validation**
    - **Property 5: CTA Link Protocol Validation**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5**

  - [x] 3.3 Create helper functions for sort order management
    - Implement getNextSortOrder function
    - Implement reorderCards function for up/down operations
    - Add to ContentService or create separate utility file
    - _Requirements: 3.6, 6.2, 6.3_

  - [ ]* 3.4 Write property tests for sort order functions
    - **Property 14: Next Sort Order Assignment**
    - **Property 19: Reorder Up Operation**
    - **Property 20: Reorder Down Operation**
    - **Validates: Requirements 3.6, 6.2, 6.3**

- [ ] 4. State management hook
  - [x] 4.1 Create useContactCards hook in src/hooks/
    - Wrap useContent hook with 'contact_cards' table
    - Implement createCard, updateCard, deleteCard methods
    - Implement bulkPublish, bulkUnpublish, bulkDeleteCards methods
    - Implement reorderCards method
    - Add publishedOnly filter option
    - Handle loading and error states
    - _Requirements: 13.2, 2.1, 3.7, 4.3, 5.3, 6.2, 6.3, 7.5, 7.6, 7.8, 8.4_

  - [ ]* 4.2 Write property tests for useContactCards hook
    - **Property 1: Contact Card Round-Trip Persistence**
    - **Property 15: Create Operation Success**
    - **Property 17: Partial Update Preservation**
    - **Property 18: Delete Operation Success**
    - **Property 21: Bulk Status Update**
    - **Validates: Requirements 1.1, 3.7, 4.3, 5.3, 7.5, 7.6**

- [x] 5. Checkpoint - Verify data layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Admin UI components - Icon Picker
  - [x] 6.1 Create IconPicker component in src/components/admin/
    - Display grid of 8 contact-related icons (Phone, Mail, MapPin, Clock, CreditCard, Heart, Users, Stethoscope)
    - Implement selection state with visual highlighting
    - Display selected icon name
    - Add keyboard navigation support
    - Make responsive (4 columns desktop, 2 columns mobile)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 6.2 Write unit tests for IconPicker
    - Test icon grid rendering
    - Test selection behavior
    - Test keyboard navigation
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 7. Admin UI components - Color Theme Selector
  - [x] 7.1 Create ColorThemeSelector component in src/components/admin/
    - Display four theme options with color swatches
    - Implement selection state with visual highlighting
    - Apply selected theme to icon preview in real-time
    - Default to primary-blue for new cards
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 7.2 Write unit tests for ColorThemeSelector
    - Test theme options rendering
    - Test selection behavior
    - Test default theme
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [x] 8. Admin UI components - Live Preview
  - [x] 8.1 Create LivePreview component in src/components/admin/
    - Render card preview matching frontend appearance
    - Display icon with selected color theme
    - Display title and short_description
    - Display CTA button if configured
    - Add desktop/mobile view mode toggle
    - Make sticky on desktop (stays visible while scrolling)
    - Update in real-time as form fields change
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

  - [ ]* 8.2 Write property test for live preview synchronization
    - **Property 24: Live Preview Synchronization**
    - **Validates: Requirements 17.2, 17.3, 17.4, 17.6, 17.7**

- [x] 9. Admin UI components - Contact Card Form
  - [x] 9.1 Create ContactCardForm component in src/components/admin/
    - Implement two-column layout: Form (left) + Live Preview (right)
    - Add input fields: title, short_description, detailed_content, cta_button_text, cta_link
    - Integrate IconPicker component
    - Integrate ColorThemeSelector component
    - Add RichTextEditor for detailed_content
    - Add status toggle (Published/Draft)
    - Add character counters with color coding
    - Implement real-time validation with field-specific errors
    - Auto-assign sort_order for new cards
    - Add cancel and submit buttons
    - Show unsaved changes warning on cancel
    - Make responsive (preview toggleable on mobile)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 4.1, 4.2, 4.5, 4.6_

  - [ ]* 9.2 Write property test for form validation
    - **Property 16: Validation Error Display**
    - **Validates: Requirements 3.8, 4.5, 16.6**

  - [ ]* 9.3 Write unit tests for ContactCardForm
    - Test form field rendering
    - Test validation error display
    - Test submit behavior
    - Test cancel behavior with unsaved changes
    - _Requirements: 3.1, 3.2, 3.8, 3.9, 4.5, 4.6_

- [ ] 10. Admin UI components - Contact Card List
  - [ ] 10.1 Create ContactCardList component in src/components/admin/
    - Display table layout with columns: Icon, Title, Description, Status, Sort Order, Actions
    - Add checkbox selection for bulk operations
    - Add "select all" checkbox in header
    - Display action buttons: Edit, Delete, Toggle Status
    - Add reorder buttons: Up/Down arrows (disabled at boundaries)
    - Show bulk action toolbar when items selected
    - Display loading skeleton during fetch
    - Display empty state with "Create First Card" prompt
    - Display error state with retry button
    - Make responsive (card layout on mobile, table on desktop)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 10.2 Write property tests for card list
    - **Property 9: Card List Ordering**
    - **Property 10: Admin Display Completeness**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 10.3 Write unit tests for ContactCardList
    - Test table rendering
    - Test checkbox selection
    - Test action buttons
    - Test reorder button states
    - Test loading and error states
    - _Requirements: 2.3, 2.5, 2.6, 2.7, 6.4, 6.5, 7.1, 7.2_

- [ ] 11. Admin page - Contact Card Manager
  - [ ] 11.1 Update ContactCardManager page in src/pages/admin/
    - Use useContactCards hook for state management
    - Render ContactCardList component
    - Handle create button click (show ContactCardForm)
    - Handle edit button click (show ContactCardForm with data)
    - Handle delete with confirmation dialog
    - Handle toggle status
    - Handle reorder operations
    - Handle bulk operations (publish, unpublish, delete)
    - Display success/error toast notifications
    - _Requirements: 2.1, 3.7, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5, 6.2, 6.3, 6.6, 7.5, 7.6, 7.7, 7.8, 16.8_

  - [ ]* 11.2 Write integration tests for ContactCardManager
    - Test create card flow
    - Test edit card flow
    - Test delete card flow
    - Test reorder flow
    - Test bulk operations flow
    - _Requirements: 3.7, 4.3, 5.3, 6.2, 6.3, 7.5, 7.6_

- [ ] 12. Checkpoint - Verify admin interface
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Public UI components - Contact Card
  - [ ] 13.1 Update ContactCard component in src/components/
    - Display icon with color theme styling
    - Display title and short_description
    - Add hover effects (shadow, slight lift)
    - Make clickable to open modal
    - Add keyboard accessibility (Enter/Space)
    - Add ARIA labels for screen readers
    - Ensure touch-friendly tap targets (min 44x44px)
    - _Requirements: 8.5, 8.6, 15.7_

  - [ ]* 13.2 Write property test for color theme application
    - **Property 12: Color Theme Application**
    - **Validates: Requirements 8.5**

  - [ ]* 13.3 Write unit tests for ContactCard
    - Test card rendering
    - Test click behavior
    - Test keyboard accessibility
    - Test hover effects
    - _Requirements: 8.5, 8.6_

- [ ] 14. Public UI components - Contact Card Modal
  - [ ] 14.1 Update ContactCardModal component in src/components/
    - Display full-screen overlay with backdrop
    - Show modal dialog with card details
    - Display header: Icon + Title
    - Display body: Detailed content (rendered as HTML)
    - Display footer: CTA button
    - Add close button (X icon)
    - Implement click outside to close
    - Implement Escape key to close
    - Add focus trap (keyboard navigation contained)
    - Add scroll lock on body when open
    - Make responsive (90% width mobile, max 600px desktop)
    - Handle CTA button clicks based on protocol (tel:/mailto:/https:)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 15.5, 15.6_

  - [ ]* 14.2 Write property tests for modal
    - **Property 22: Modal Content Display**
    - **Property 23: CTA Link Protocol Routing**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.6, 9.7, 9.8**

  - [ ]* 14.3 Write unit tests for ContactCardModal
    - Test modal rendering
    - Test close behavior (button, outside click, Escape)
    - Test CTA button protocol handling
    - Test focus trap
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.9, 9.10_

- [ ] 15. Public UI components - Contact Section
  - [ ] 15.1 Update ContactSection component in src/components/
    - Use useContactCards hook with publishedOnly filter
    - Display cards in responsive grid layout:
      - Desktop (≥1024px): 2x2 grid
      - Tablet (768-1023px): 2 columns
      - Mobile (<768px): Single column
    - Order cards by sort_order ascending
    - Display loading skeleton during fetch
    - Display empty state if no published cards
    - Display error state with user-friendly message
    - Add smooth animations on card hover
    - Handle card click to open modal
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7, 8.8, 8.9, 15.1, 15.2, 15.3_

  - [ ]* 15.2 Write property tests for contact section
    - **Property 9: Card List Ordering**
    - **Property 11: Published Card Filtering**
    - **Property 13: Public Display Completeness**
    - **Validates: Requirements 8.3, 8.4, 8.6**

  - [ ]* 15.3 Write unit tests for ContactSection
    - Test grid layout rendering
    - Test loading state
    - Test empty state
    - Test error state
    - Test card click behavior
    - _Requirements: 8.1, 8.2, 8.7, 8.8, 8.9_

- [ ] 16. Responsive design implementation
  - [ ] 16.1 Add responsive styles to all components
    - Implement breakpoint-specific layouts
    - Scale typography appropriately
    - Scale icons and containers
    - Adjust modal behavior for mobile
    - Ensure touch targets meet minimum size (44x44px)
    - Optimize animations for mobile performance
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [ ]* 16.2 Write unit tests for responsive behavior
    - Test grid layout at different breakpoints
    - Test modal sizing at different breakpoints
    - Test touch target sizes
    - _Requirements: 15.1, 15.2, 15.3, 15.5, 15.6, 15.7_

- [ ] 17. Error handling and loading states
  - [ ] 17.1 Implement error handling patterns
    - Add validation error display in forms
    - Add network error handling with retry
    - Add authentication error handling with redirect
    - Add database constraint violation handling
    - Add not found error handling
    - Add concurrent modification error handling
    - _Requirements: 16.5, 16.6, 16.7_

  - [ ] 17.2 Implement loading states
    - Add skeleton loaders for initial data load
    - Add form submission loading states
    - Add delete operation loading states
    - Add bulk operation loading states with progress
    - Add reorder operation loading states
    - _Requirements: 2.6, 8.8, 16.1, 16.2, 16.3, 16.4_

  - [ ] 17.3 Implement user feedback
    - Add success toast notifications
    - Add error toast notifications
    - Add confirmation dialogs for destructive actions
    - Add unsaved changes warning
    - _Requirements: 5.1, 5.2, 5.5, 7.7, 16.8_

- [ ] 18. RLS policy testing
  - [ ]* 18.1 Write property tests for RLS policies
    - **Property 25: Public Read Access (RLS)**
    - **Property 26: Admin Full Access (RLS)**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**

- [ ] 19. Seed data creation
  - [ ] 19.1 Create seed data script
    - Create SQL script or TypeScript function for seed data
    - Add "Call Us" card (Phone icon, primary-blue, tel: link, sort_order 0)
    - Add "Email Us" card (Mail icon, secondary-green, mailto: link, sort_order 1)
    - Add "Visit Us" card (MapPin icon, accent-teal, https: link to maps, sort_order 2)
    - Add "Opening Hours" card (Clock icon, neutral-gray, https: link, sort_order 3)
    - Set all cards to published status
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [ ]* 19.2 Write unit test for seed data
    - Test seed script creates exactly 4 cards
    - Test each card has correct properties
    - Test all cards are published
    - Test sort_order values are sequential
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 20. Integration and routing
  - [ ] 20.1 Add admin navigation link
    - Update admin navigation to include /admin/contact-cards link
    - Add appropriate icon and label
    - _Requirements: 13.3_

  - [ ] 20.2 Verify ContentService integration
    - Test all CRUD operations work correctly
    - Test error handling patterns
    - Test loading state patterns
    - _Requirements: 13.1, 13.5, 13.6_

- [ ] 21. Checkpoint - Verify complete feature
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Accessibility testing
  - [ ]* 22.1 Run automated accessibility tests
    - Use axe-core to test all components
    - Verify ARIA labels and roles
    - Verify keyboard navigation
    - Verify color contrast ratios
    - Verify focus management in modals
    - Verify screen reader announcements

- [ ] 23. End-to-end testing
  - [ ]* 23.1 Write E2E test for admin create and publish flow
    - Login as admin
    - Navigate to contact cards page
    - Create new card
    - Publish card
    - Verify card appears on public website

  - [ ]* 23.2 Write E2E test for public user viewing card
    - Navigate to public website
    - Click contact card
    - Verify modal opens with details
    - Click CTA button
    - Verify correct action

  - [ ]* 23.3 Write E2E test for admin reordering
    - Login as admin
    - Reorder cards
    - Verify order persists
    - Verify public display matches new order

- [ ] 24. Performance optimization
  - [ ]* 24.1 Run performance tests
    - Test page load with 20+ cards
    - Test rapid form field changes
    - Test bulk operations on 10+ cards
    - Test modal open/close performance
    - Optimize as needed to meet performance targets

- [ ] 25. Final integration and documentation
  - [ ] 25.1 Run seed data script
    - Execute seed script to populate initial data
    - Verify all 4 default cards created correctly
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [ ] 25.2 Final verification
    - Test complete admin workflow (create, edit, delete, reorder, bulk ops)
    - Test complete public workflow (view cards, open modals, click CTAs)
    - Verify responsive design on multiple devices
    - Verify accessibility with keyboard and screen reader
    - Verify all error states and loading states work correctly

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across all inputs (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests verify component interactions and data flow
- E2E tests verify complete user workflows
- Checkpoints ensure incremental validation at key milestones
- The implementation follows the existing codebase patterns (ContentService, useContent hook, shadcn/ui components)
- All components use TypeScript for type safety
- All components follow accessibility best practices (WCAG 2.1 Level AA)
- All components are responsive and mobile-friendly
