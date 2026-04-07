/**
 * AuthGuard Component
 * 
 * Protects admin routes from unauthorized access by checking authentication
 * status and redirecting unauthenticated users to the login page.
 * 
 * Features:
 * - Checks authentication status on mount
 * - Redirects to login if unauthenticated
 * - Shows loading state during auth check
 * - Passes authenticated user to children
 * 
 * Requirements: 1.1, 1.2
 */

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoadingFallback } from './LoadingFallback';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * 
 * @example
 * ```tsx
 * <Route path="/admin/*" element={
 *   <AuthGuard>
 *     <AdminLayout />
 *   </AuthGuard>
 * } />
 * ```
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <PageLoadingFallback />;
  }

  // Redirect to login if not authenticated, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default AuthGuard;
