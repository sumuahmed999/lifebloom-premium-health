/**
 * ContactInfoForm Component
 * 
 * Form for editing contact information.
 * Includes email and phone validation, and structured operating hours.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.5, 6.6
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import type { ContactInfo, OperatingHours } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface ContactInfoFormProps {
  /** Initial data for edit mode */
  initialData?: ContactInfo;
  /** Callback when form is submitted */
  onSubmit: (data: Omit<ContactInfo, 'id' | 'updated_at' | 'updated_by'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

interface FormData {
  address: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  operating_hours: OperatingHours;
}

interface FormErrors {
  address?: string;
  primary_phone?: string;
  secondary_phone?: string;
  email?: string;
  operating_hours?: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// ============================================================================
// Component
// ============================================================================

export function ContactInfoForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: ContactInfoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    address: initialData?.address || '',
    primary_phone: initialData?.primary_phone || '',
    secondary_phone: initialData?.secondary_phone || '',
    email: initialData?.email || '',
    operating_hours: initialData?.operating_hours || {
      Monday: { open: '09:00', close: '17:00', closed: false },
      Tuesday: { open: '09:00', close: '17:00', closed: false },
      Wednesday: { open: '09:00', close: '17:00', closed: false },
      Thursday: { open: '09:00', close: '17:00', closed: false },
      Friday: { open: '09:00', close: '17:00', closed: false },
      Saturday: { open: '10:00', close: '14:00', closed: false },
      Sunday: { open: '00:00', close: '00:00', closed: true },
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic validation)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.primary_phone.trim()) {
      newErrors.primary_phone = 'Primary phone is required';
    } else if (!validatePhone(formData.primary_phone)) {
      newErrors.primary_phone = 'Please enter a valid phone number';
    }

    if (formData.secondary_phone && !validatePhone(formData.secondary_phone)) {
      newErrors.secondary_phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle operating hours changes
  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: any) => {
    setFormData(prev => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: {
          ...prev.operating_hours[day],
          [field]: value,
        },
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter business address..."
              rows={3}
              disabled={submitting}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Primary Phone */}
          <div className="space-y-2">
            <Label htmlFor="primary_phone">
              Primary Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="primary_phone"
              value={formData.primary_phone}
              onChange={(e) => handleChange('primary_phone', e.target.value)}
              placeholder="(555) 123-4567"
              disabled={submitting}
            />
            {errors.primary_phone && (
              <p className="text-sm text-destructive">{errors.primary_phone}</p>
            )}
          </div>

          {/* Secondary Phone */}
          <div className="space-y-2">
            <Label htmlFor="secondary_phone">Secondary Phone</Label>
            <Input
              id="secondary_phone"
              value={formData.secondary_phone}
              onChange={(e) => handleChange('secondary_phone', e.target.value)}
              placeholder="(555) 987-6543"
              disabled={submitting}
            />
            {errors.secondary_phone && (
              <p className="text-sm text-destructive">{errors.secondary_phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@example.com"
              disabled={submitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28 font-medium">{day}</div>
              <Switch
                checked={!formData.operating_hours[day]?.closed}
                onCheckedChange={(checked) => handleHoursChange(day, 'closed', !checked)}
                disabled={submitting}
              />
              {!formData.operating_hours[day]?.closed ? (
                <>
                  <Input
                    type="time"
                    value={formData.operating_hours[day]?.open || '09:00'}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    disabled={submitting}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={formData.operating_hours[day]?.close || '17:00'}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    disabled={submitting}
                    className="w-32"
                  />
                </>
              ) : (
                <span className="text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Saving...' : 'Save Contact Info'}
        </Button>
      </div>
    </form>
  );
}

export default ContactInfoForm;
