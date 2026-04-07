# Services Layer

This directory contains service classes for the Admin Content Management system.

## ValidationService

The `ValidationService` class provides comprehensive validation methods for all content types and common field validations.

### Features

#### Common Field Validations
- **validateEmail(email: string)**: Validates email format (RFC 5322 compliant)
- **validatePhone(phone: string)**: Validates phone number format (supports various formats)
- **validateUrl(url: string)**: Validates URL format (requires http/https protocol)
- **validateNumeric(value: any)**: Validates that a value is a valid number

#### Image Validation
- **validateImage(file: File, maxSizeMB?: number)**: Validates image file type and size
  - Accepted formats: JPEG, PNG, WebP
  - Default max size: 5MB
  - Returns ValidationResult with specific error messages

#### Content-Specific Validations
- **validateService(data: Partial<Service>)**: Validates service data
  - Required: title, description, icon, features, color_scheme
  - Validates field lengths and data types

- **validateTestimonial(data: Partial<Testimonial>)**: Validates testimonial data
  - Required: customer_name, testimonial_text, rating
  - Rating must be between 1 and 5
  - Optional image URL validation

- **validateBlogPost(data: Partial<BlogPost>)**: Validates blog post data
  - Required: title, content, author, category
  - Optional: read_time (must be positive), image_url

- **validateVideoPost(data: Partial<VideoPost>)**: Validates video post data
  - Required: title, video_url, category, duration
  - Duration must be positive
  - URL format validation for video and thumbnail

- **validateContactInfo(data: Partial<ContactInfo>)**: Validates contact information
  - Required: address, primary_phone, email, operating_hours
  - Email and phone format validation
  - Operating hours structure validation

### Usage Example

```typescript
import { ValidationService } from '@/lib/services';

// Validate email
const isValidEmail = ValidationService.validateEmail('user@example.com');

// Validate service data
const serviceData = {
  title: 'Health Checkup',
  description: 'Comprehensive health screening',
  icon: 'heart',
  features: ['Blood test', 'X-ray'],
  color_scheme: 'blue'
};
const result = ValidationService.validateService(serviceData);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Validate image file
const file = document.querySelector('input[type="file"]').files[0];
const imageResult = ValidationService.validateImage(file);

if (!imageResult.valid) {
  console.error('Image validation errors:', imageResult.errors);
}
```

### Requirements Coverage

This service implements validation for the following requirements:
- 2.8: Service required field validation
- 3.8: Testimonial rating validation (1-5)
- 4.11: Blog post required field validation
- 5.10: Video post required field validation
- 5.11: Video duration validation (positive number)
- 6.5: Email format validation
- 6.6: Phone format validation
- 10.2: Image file type validation
- 10.6, 10.7: Image file size validation
- 11.6: URL format validation
- 11.7: Numeric field validation

### Testing

Unit tests are available in `ValidationService.test.ts`. The tests cover:
- Valid and invalid email formats
- Various phone number formats
- URL validation with different protocols
- Numeric value validation
- Image file type and size validation
- All content-specific validation methods
- Edge cases and boundary conditions

**Note**: Tests require vitest to be installed and configured. See the main project README for test setup instructions.

### Return Types

All content validation methods return a `ValidationResult`:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
```

- `valid`: true if all validations pass, false otherwise
- `errors`: Object mapping field names to error messages

### Design Decisions

1. **Static Methods**: All methods are static since validation is stateless
2. **Flexible Phone Validation**: Accepts various phone formats for better UX
3. **Strict URL Validation**: Only accepts http/https protocols for security
4. **Detailed Error Messages**: Each error includes context (e.g., current file size)
5. **Type Safety**: Uses TypeScript interfaces for all content types
6. **Reusable Validators**: Common validators (email, phone, URL) are used by content validators
