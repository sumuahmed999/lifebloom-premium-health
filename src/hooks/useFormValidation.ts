/**
 * useFormValidation Hook
 * 
 * Generic hook for real-time form validation with error tracking and touched state management.
 * 
 * Requirements: 13.5, 13.6, 13.7
 */

import { useState, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface UseFormValidationOptions<T> {
  /** Initial form data */
  initialData: T;
  /** Validation function that returns validation result */
  validationFn: (data: T) => { valid: boolean; errors: Record<string, string> };
  /** Whether to validate on change (default: true) */
  validateOnChange?: boolean;
  /** Whether to validate on blur (default: true) */
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T> {
  /** Current form data */
  data: T;
  /** Validation errors keyed by field name */
  errors: Record<string, string>;
  /** Touched state for each field */
  touched: Record<string, boolean>;
  /** Whether the form is valid (no errors) */
  isValid: boolean;
  /** Handle field value change */
  handleChange: (field: keyof T, value: any) => void;
  /** Handle field blur event */
  handleBlur: (field: keyof T) => void;
  /** Manually trigger validation for all fields */
  validate: () => boolean;
  /** Reset form to initial or provided data */
  reset: (newData?: T) => void;
  /** Set form data directly */
  setData: (data: T) => void;
  /** Set errors directly */
  setErrors: (errors: Record<string, string>) => void;
  /** Mark field as touched */
  setTouched: (field: keyof T, touched: boolean) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for form validation with real-time feedback
 * 
 * @param options - Configuration options
 * @returns Form validation interface
 * 
 * @example
 * ```tsx
 * function ContactCardForm() {
 *   const {
 *     data,
 *     errors,
 *     touched,
 *     isValid,
 *     handleChange,
 *     handleBlur,
 *     validate,
 *     reset
 *   } = useFormValidation({
 *     initialData: {
 *       title: '',
 *       short_description: '',
 *       cta_link: ''
 *     },
 *     validationFn: validateContactCard
 *   });
 *   
 *   const handleSubmit = () => {
 *     if (validate()) {
 *       // Submit form
 *     }
 *   };
 *   
 *   return (
 *     <form>
 *       <Input
 *         value={data.title}
 *         onChange={(e) => handleChange('title', e.target.value)}
 *         onBlur={() => handleBlur('title')}
 *       />
 *       {touched.title && errors.title && (
 *         <p className="text-destructive">{errors.title}</p>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
export function useFormValidation<T extends Record<string, any>>({
  initialData,
  validationFn,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  /**
   * Handle field value change
   * Updates data and optionally validates
   */
  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      const newData = { ...data, [field]: value };
      setData(newData);

      // Mark field as touched on change
      setTouchedState((prev) => ({ ...prev, [field]: true }));

      // Validate on change if enabled
      if (validateOnChange) {
        const result = validationFn(newData);
        setErrors(result.errors);
      }
    },
    [data, validationFn, validateOnChange]
  );

  /**
   * Handle field blur event
   * Marks field as touched and optionally validates
   */
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouchedState((prev) => ({ ...prev, [field]: true }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        const result = validationFn(data);
        setErrors(result.errors);
      }
    },
    [data, validationFn, validateOnBlur]
  );

  /**
   * Manually trigger validation for all fields
   * Marks all fields as touched
   * 
   * @returns true if form is valid, false otherwise
   */
  const validate = useCallback(() => {
    const result = validationFn(data);
    setErrors(result.errors);

    // Mark all fields as touched
    const allTouched = Object.keys(data).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouchedState(allTouched);

    return result.valid;
  }, [data, validationFn]);

  /**
   * Reset form to initial or provided data
   * Clears errors and touched state
   */
  const reset = useCallback(
    (newData?: T) => {
      setData(newData || initialData);
      setErrors({});
      setTouchedState({});
    },
    [initialData]
  );

  /**
   * Mark field as touched
   */
  const setTouched = useCallback((field: keyof T, touchedValue: boolean) => {
    setTouchedState((prev) => ({ ...prev, [field]: touchedValue }));
  }, []);

  /**
   * Computed property: whether form is valid
   */
  const isValid = Object.keys(errors).length === 0;

  return {
    data,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validate,
    reset,
    setData,
    setErrors,
    setTouched,
  };
}

export default useFormValidation;
