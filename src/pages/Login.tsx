/**
 * Login Page Component
 * 
 * Provides the authentication UI for administrators to log in to the admin panel.
 * 
 * Features:
 * - Login form with email and password fields
 * - Form validation
 * - Error message display
 * - Redirects to intended destination after successful login
 * 
 * Requirements: 1.2, 1.3
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Login page component
 */
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  /**
   * Sanitize input — strip null bytes and control characters
   */
  const sanitize = (value: string) =>
    value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);

    if (!cleanEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (cleanEmail.length > 254) {
      errors.email = 'Email address is too long';
    }

    if (!cleanPassword) {
      errors.password = 'Password is required';
    } else if (cleanPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (cleanPassword.length > 128) {
      errors.password = 'Password is too long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) {
        setResetError(error.message);
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError('Something went wrong. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(sanitize(email), sanitize(password));

      if (result.success) {
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking initial auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">

        {/* Forgot Password Mode */}
        {forgotMode ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetSent ? (
                <div className="text-center space-y-4">
                  <div className="text-4xl">📧</div>
                  <p className="text-sm text-muted-foreground">
                    Reset link sent to <strong>{resetEmail}</strong>. Check your inbox and click the link to set a new password.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(''); }}>
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setResetError(''); }}
                      disabled={resetLoading}
                      autoComplete="email"
                    />
                  </div>
                  {resetError && (
                    <Alert variant="destructive">
                      <AlertDescription>{resetError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={resetLoading}>
                    {resetLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Link'}
                  </Button>
                  <button type="button" onClick={() => setForgotMode(false)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center">
                    Back to Login
                  </button>
                </form>
              )}
            </CardContent>
          </>
        ) : (
          /* Login Mode */
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, email: undefined }));
                      setError('');
                    }}
                    disabled={isSubmitting}
                    className={validationErrors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setResetEmail(email); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, password: undefined }));
                        setError('');
                      }}
                      disabled={isSubmitting}
                      className={validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                  ) : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;
