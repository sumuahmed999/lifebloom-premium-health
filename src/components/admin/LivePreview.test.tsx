/**
 * LivePreview Component Tests
 * 
 * Tests for the LivePreview component to ensure it renders correctly
 * and updates in real-time as form data changes.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LivePreview } from './LivePreview';
import type { ContactCardFormData } from '@/types/admin-content';

describe('LivePreview Component', () => {
  const mockFormData: ContactCardFormData = {
    icon: 'Phone',
    title: 'Test Card',
    short_description: 'This is a test description',
    detailed_content: '<p>Detailed content here</p>',
    cta_button_text: 'Call Now',
    cta_link: 'tel:+1234567890',
    color_theme: 'primary-blue',
    status: true,
    sort_order: 0,
  };

  const mockOnViewModeChange = jest.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  it('should render the preview with form data', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    // Check that title is displayed
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    
    // Check that description is displayed
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    
    // Check that CTA button is displayed
    expect(screen.getByText('Call Now')).toBeInTheDocument();
  });

  it('should display placeholder text when title is empty', () => {
    const emptyFormData = { ...mockFormData, title: '' };
    
    render(
      <LivePreview
        formData={emptyFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should display placeholder text when description is empty', () => {
    const emptyFormData = { ...mockFormData, short_description: '' };
    
    render(
      <LivePreview
        formData={emptyFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText('Short description will appear here...')).toBeInTheDocument();
  });

  it('should not show CTA button when link is missing', () => {
    const noLinkFormData = { ...mockFormData, cta_link: '' };
    
    render(
      <LivePreview
        formData={noLinkFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.queryByText('Call Now')).not.toBeInTheDocument();
  });

  it('should not show CTA button when button text is missing', () => {
    const noButtonTextFormData = { ...mockFormData, cta_button_text: '' };
    
    render(
      <LivePreview
        formData={noButtonTextFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.queryByRole('button', { name: /call now/i })).not.toBeInTheDocument();
  });

  it('should switch to mobile view when mobile button is clicked', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const mobileButton = screen.getByLabelText('Mobile view');
    fireEvent.click(mobileButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('mobile');
  });

  it('should switch to desktop view when desktop button is clicked', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="mobile"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const desktopButton = screen.getByLabelText('Desktop view');
    fireEvent.click(desktopButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('desktop');
  });

  it('should highlight the active view mode button', () => {
    const { rerender } = render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const desktopButton = screen.getByLabelText('Desktop view');
    expect(desktopButton).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <LivePreview
        formData={mockFormData}
        viewMode="mobile"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const mobileButton = screen.getByLabelText('Mobile view');
    expect(mobileButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should display theme information', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText(/Theme:/)).toBeInTheDocument();
    expect(screen.getByText(/Primary Blue/)).toBeInTheDocument();
  });

  it('should display icon information', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText(/Icon:/)).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('should display CTA link information when present', () => {
    render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText(/CTA Link:/)).toBeInTheDocument();
    expect(screen.getByText('tel:+1234567890')).toBeInTheDocument();
  });

  it('should apply correct theme classes', () => {
    const { container } = render(
      <LivePreview
        formData={mockFormData}
        viewMode="desktop"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    // Check that theme-specific classes are applied
    const previewCard = container.querySelector('[role="article"]');
    expect(previewCard).toHaveClass('bg-blue-50');
    expect(previewCard).toHaveClass('border-blue-200');
  });

  it('should render with different color themes', () => {
    const themes: Array<ContactCardFormData['color_theme']> = [
      'primary-blue',
      'secondary-green',
      'accent-teal',
      'neutral-gray',
    ];

    themes.forEach((theme) => {
      const { container } = render(
        <LivePreview
          formData={{ ...mockFormData, color_theme: theme }}
          viewMode="desktop"
          onViewModeChange={mockOnViewModeChange}
        />
      );

      const previewCard = container.querySelector('[role="article"]');
      expect(previewCard).toBeInTheDocument();
    });
  });
});
