# Requirements Document

## Introduction

The Dynamic Get in Touch Admin Panel feature enables administrators to fully manage the "Get in Touch" section contact cards through an admin interface. This system allows creation, editing, deletion, reordering, and publishing control of contact cards that display information such as phone numbers, email addresses, physical locations, and operating hours. Each card supports rich content displayed in modals, customizable icons with color themes, and call-to-action buttons with various link types (tel:, mailto:, https:).

## Glossary

- **Contact_Card**: A visual card component displaying contact information with an icon, title, short description, and click-to-expand functionality
- **Admin_Panel**: The authenticated administrative interface for managing website content
- **CTA_Button**: Call-to-action button with configurable text and link (telephone, email, or web URL)
- **Color_Theme**: Predefined color scheme applied to card icons (primary-blue, secondary-green, accent-teal, neutral-gray)
- **Modal**: Overlay dialog displaying detailed content when a contact card is clicked
- **RLS_Policy**: Row Level Security policy controlling database access permissions
- **Sort_Order**: Integer value determining the display sequence of contact cards
- **Status**: Boolean flag indicating whether a card is published (visible to public) or unpublished (hidden)
- **ContentService**: Existing service class providing CRUD operations for content management
- **Icon_Picker**: UI component for selecting icons from a predefined set

## Requirements

### Requirement 1: Contact Card Data Management

**User Story:** As an administrator, I want to create and manage contact cards with comprehensive information, so that I can provide visitors with multiple ways to contact our organization.

#### Acceptance Criteria

1. WHEN an administrator creates a contact card, THE System SHALL store the icon, title, short_description, detailed_content, cta_button_text, cta_link, color_theme, status, and sort_order
2. THE System SHALL validate that title length is between 1 and 100 characters
3. THE System SHALL validate that short_description length does not exceed 200 characters
4. THE System SHALL validate that detailed_content length does not exceed 5000 characters
5. THE System SHALL validate that cta_link matches the pattern `^(tel:|mailto:|https:).+`
6. THE System SHALL enforce unique sort_order values across all contact cards
7. WHEN a contact card is created or updated, THE System SHALL automatically set the updated_at timestamp
8. THE System SHALL support four color themes: primary-blue, secondary-green, accent-teal, and neutral-gray

### Requirement 2: Admin Panel Contact Card List Interface

**User Story:** As an administrator, I want to view all contact cards in a list with management controls, so that I can efficiently organize and maintain contact information.

#### Acceptance Criteria

1. WHEN an administrator navigates to /admin/contact-cards, THE Admin_Panel SHALL display all contact cards ordered by sort_order
2. THE Admin_Panel SHALL display each card's icon, title, short_description, status, and sort_order
3. THE Admin_Panel SHALL provide action buttons for edit, delete, and status toggle on each card
4. THE Admin_Panel SHALL display visual indicators distinguishing published from unpublished cards
5. WHEN the list is empty, THE Admin_Panel SHALL display a message prompting the administrator to create the first card
6. THE Admin_Panel SHALL display loading states during data fetch operations
7. WHEN an error occurs during data fetch, THE Admin_Panel SHALL display an error message with retry option

### Requirement 3: Contact Card Creation Interface

**User Story:** As an administrator, I want to create new contact cards through a form interface, so that I can add new contact methods to the website.

#### Acceptance Criteria

1. WHEN an administrator clicks the create button, THE Admin_Panel SHALL display a contact card creation form
2. THE Admin_Panel SHALL provide input fields for title, short_description, detailed_content, cta_button_text, and cta_link
3. THE Admin_Panel SHALL provide an Icon_Picker for selecting the card icon
4. THE Admin_Panel SHALL provide a color theme selector with visual previews of all four themes
5. THE Admin_Panel SHALL provide a status toggle for published/unpublished
6. THE Admin_Panel SHALL automatically assign the next available sort_order value
7. WHEN the administrator submits the form with valid data, THE System SHALL create the contact card and refresh the list
8. WHEN the administrator submits the form with invalid data, THE Admin_Panel SHALL display field-specific validation errors
9. THE Admin_Panel SHALL provide a cancel button that discards changes and closes the form

### Requirement 4: Contact Card Editing Interface

**User Story:** As an administrator, I want to edit existing contact cards, so that I can update contact information as it changes.

#### Acceptance Criteria

1. WHEN an administrator clicks the edit button on a card, THE Admin_Panel SHALL display a pre-populated edit form
2. THE Admin_Panel SHALL load all current field values into the form
3. WHEN the administrator modifies fields and submits, THE System SHALL update only the changed fields
4. THE System SHALL preserve the sort_order unless explicitly changed
5. WHEN the administrator submits with invalid data, THE Admin_Panel SHALL display field-specific validation errors
6. THE Admin_Panel SHALL provide a cancel button that discards changes and closes the form

### Requirement 5: Contact Card Deletion

**User Story:** As an administrator, I want to delete contact cards that are no longer needed, so that I can keep the contact section current and relevant.

#### Acceptance Criteria

1. WHEN an administrator clicks the delete button on a card, THE Admin_Panel SHALL display a confirmation dialog
2. THE Admin_Panel SHALL display the card title in the confirmation message
3. WHEN the administrator confirms deletion, THE System SHALL remove the card from the database
4. WHEN the administrator confirms deletion, THE System SHALL refresh the card list
5. WHEN the administrator cancels deletion, THE Admin_Panel SHALL close the dialog without changes
6. IF deletion fails, THE Admin_Panel SHALL display an error message and retain the card

### Requirement 6: Contact Card Reordering

**User Story:** As an administrator, I want to reorder contact cards, so that I can control the display sequence on the frontend.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide up and down arrow buttons for each card
2. WHEN an administrator clicks the up arrow, THE System SHALL decrease the card's sort_order and increase the previous card's sort_order
3. WHEN an administrator clicks the down arrow, THE System SHALL increase the card's sort_order and decrease the next card's sort_order
4. THE Admin_Panel SHALL disable the up arrow for the first card
5. THE Admin_Panel SHALL disable the down arrow for the last card
6. WHEN reordering completes, THE Admin_Panel SHALL refresh the list to reflect the new order
7. IF reordering fails, THE Admin_Panel SHALL display an error message and revert to the previous order

### Requirement 7: Bulk Operations

**User Story:** As an administrator, I want to perform bulk operations on multiple contact cards, so that I can efficiently manage large numbers of cards.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide checkboxes for selecting multiple cards
2. THE Admin_Panel SHALL provide a "select all" checkbox in the list header
3. WHEN cards are selected, THE Admin_Panel SHALL display a bulk actions toolbar
4. THE Admin_Panel SHALL provide bulk publish, bulk unpublish, and bulk delete actions
5. WHEN the administrator triggers bulk publish, THE System SHALL set status to true for all selected cards
6. WHEN the administrator triggers bulk unpublish, THE System SHALL set status to false for all selected cards
7. WHEN the administrator triggers bulk delete, THE Admin_Panel SHALL display a confirmation dialog with the count of selected cards
8. WHEN bulk operations complete, THE Admin_Panel SHALL refresh the list and clear selections

### Requirement 8: Frontend Contact Card Display

**User Story:** As a website visitor, I want to view contact cards in an organized grid layout, so that I can easily find the contact method I need.

#### Acceptance Criteria

1. THE System SHALL display published contact cards in a 2x2 grid layout on desktop viewports
2. THE System SHALL display contact cards in a single column on mobile viewports
3. THE System SHALL order cards by sort_order ascending
4. THE System SHALL display only cards where status equals true
5. THE System SHALL display each card's icon with the configured color_theme
6. THE System SHALL display each card's title and short_description
7. WHEN no published cards exist, THE System SHALL display a fallback message
8. THE System SHALL display a loading skeleton during data fetch
9. IF data fetch fails, THE System SHALL display an error message

### Requirement 9: Contact Card Modal Interaction

**User Story:** As a website visitor, I want to click contact cards to view detailed information, so that I can access comprehensive contact details.

#### Acceptance Criteria

1. WHEN a visitor clicks a contact card, THE System SHALL open a Modal displaying the detailed_content
2. THE Modal SHALL display the card's icon and title in the header
3. THE Modal SHALL render detailed_content as HTML with proper formatting
4. THE Modal SHALL display the CTA_Button with cta_button_text
5. WHEN the visitor clicks the CTA_Button, THE System SHALL navigate to the cta_link
6. WHEN cta_link starts with "tel:", THE System SHALL initiate a phone call
7. WHEN cta_link starts with "mailto:", THE System SHALL open the default email client
8. WHEN cta_link starts with "https:", THE System SHALL open the URL in a new browser tab
9. THE Modal SHALL provide a close button that dismisses the modal
10. WHEN the visitor clicks outside the Modal, THE System SHALL close the modal

### Requirement 10: Icon Picker Component

**User Story:** As an administrator, I want to select icons from a visual picker, so that I can easily choose appropriate icons for contact cards.

#### Acceptance Criteria

1. THE Icon_Picker SHALL display a grid of available icons
2. THE Icon_Picker SHALL support common contact-related icons: phone, mail, map-pin, clock, message-circle, calendar, user, building
3. WHEN an administrator clicks an icon, THE Icon_Picker SHALL highlight the selected icon
4. THE Icon_Picker SHALL display the selected icon name
5. THE Icon_Picker SHALL apply the selected color_theme to the icon preview
6. WHEN no icon is selected, THE Icon_Picker SHALL display a placeholder message

### Requirement 11: Color Theme Selector

**User Story:** As an administrator, I want to select color themes with visual previews, so that I can maintain consistent visual design across contact cards.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display four color theme options: primary-blue, secondary-green, accent-teal, neutral-gray
2. THE Admin_Panel SHALL display each theme option with a visual color swatch
3. WHEN an administrator clicks a theme option, THE Admin_Panel SHALL highlight the selected theme
4. THE Admin_Panel SHALL apply the selected theme to the icon preview in real-time
5. THE Admin_Panel SHALL default to primary-blue when creating new cards

### Requirement 12: Database Row Level Security

**User Story:** As a system administrator, I want database access controlled by RLS policies, so that contact card data is properly secured.

#### Acceptance Criteria

1. THE System SHALL allow public users to view cards where status equals true
2. THE System SHALL allow authenticated administrators to view all cards regardless of status
3. THE System SHALL allow authenticated administrators to insert new cards
4. THE System SHALL allow authenticated administrators to update existing cards
5. THE System SHALL allow authenticated administrators to delete cards
6. THE System SHALL deny all write operations to unauthenticated users

### Requirement 13: Integration with Existing Systems

**User Story:** As a developer, I want the contact cards feature to integrate with existing services and components, so that the implementation is consistent with the codebase.

#### Acceptance Criteria

1. THE System SHALL use ContentService for all CRUD operations on contact_cards
2. THE System SHALL use the useContactCards hook for state management in React components
3. THE Admin_Panel SHALL integrate the contact cards management page into the existing admin navigation
4. THE System SHALL use existing UI components: Button, Input, Dialog, Select, Textarea
5. THE System SHALL follow the existing error handling patterns from ContentService
6. THE System SHALL use the existing loading state patterns from useContent hook

### Requirement 14: Seed Data Initialization

**User Story:** As a developer, I want default contact cards created during setup, so that the feature has example data for testing and demonstration.

#### Acceptance Criteria

1. THE System SHALL provide seed data for four default contact cards
2. THE System SHALL create a "Call Us" card with phone icon, primary-blue theme, and tel: link
3. THE System SHALL create an "Email Us" card with mail icon, secondary-green theme, and mailto: link
4. THE System SHALL create a "Visit Us" card with map-pin icon, accent-teal theme, and https: link to maps
5. THE System SHALL create an "Opening Hours" card with clock icon, neutral-gray theme, and https: link
6. THE System SHALL set all seed cards to published status
7. THE System SHALL assign sequential sort_order values (0, 1, 2, 3) to seed cards

### Requirement 15: Responsive Design

**User Story:** As a website visitor using various devices, I want the contact cards to display properly on all screen sizes, so that I can access contact information regardless of my device.

#### Acceptance Criteria

1. WHEN viewport width is 1024px or greater, THE System SHALL display cards in a 2x2 grid
2. WHEN viewport width is between 768px and 1023px, THE System SHALL display cards in a 2-column grid
3. WHEN viewport width is less than 768px, THE System SHALL display cards in a single column
4. THE System SHALL scale card dimensions proportionally to viewport size
5. THE Modal SHALL occupy 90% of viewport width on mobile devices
6. THE Modal SHALL occupy a maximum of 600px width on desktop devices
7. THE System SHALL ensure touch targets are at least 44x44 pixels on mobile devices

### Requirement 16: Loading States and Error Handling

**User Story:** As a user, I want clear feedback during loading and error states, so that I understand the system status.

#### Acceptance Criteria

1. WHEN data is loading, THE System SHALL display skeleton loaders matching the card layout
2. WHEN a create operation is in progress, THE Admin_Panel SHALL disable the submit button and display a loading indicator
3. WHEN an update operation is in progress, THE Admin_Panel SHALL disable the submit button and display a loading indicator
4. WHEN a delete operation is in progress, THE Admin_Panel SHALL disable action buttons and display a loading indicator
5. IF a network error occurs, THE System SHALL display an error message with a retry button
6. IF a validation error occurs, THE System SHALL display field-specific error messages below the relevant inputs
7. IF an authentication error occurs, THE System SHALL redirect to the login page
8. WHEN an operation succeeds, THE System SHALL display a success toast notification

### Requirement 17: Live Preview

**User Story:** As an administrator, I want to preview contact card changes before saving, so that I can verify the appearance and content.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a live preview panel in the create/edit form
2. THE Admin_Panel SHALL update the preview in real-time as form fields change
3. THE Admin_Panel SHALL render the preview with the selected icon and color_theme
4. THE Admin_Panel SHALL display the title and short_description in the preview
5. THE Admin_Panel SHALL apply the same styling as the frontend card display
6. THE Admin_Panel SHALL update the preview when the color_theme changes
7. THE Admin_Panel SHALL update the preview when the icon changes
