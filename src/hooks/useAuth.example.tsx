/**
 * useAuth Hook Usage Examples
 * 
 * Demonstrates how to use the useAuth hook in various scenarios.
 */

import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// Example 1: Login Page Component
// ============================================================================

/**
 * Simple login page that uses useAuth for authentication
 */
export function LoginPageExample() {
  const { signIn, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn(email, password);
    
    if (result.success) {
      // Navigation will happen via useEffect above
      console.log('Login successful');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Example 2: Protected Route Component
// ============================================================================

/**
 * Component that protects routes requiring authentication
 */
export function ProtectedRouteExample({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

// ============================================================================
// Example 3: User Profile Display
// ============================================================================

/**
 * Component that displays current user information
 */
export function UserProfileExample() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    
    if (result.success) {
      navigate('/login');
    } else {
      console.error('Sign out failed:', result.error);
    }
  };

  if (!isAuthenticated || !user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="user-profile">
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>User ID:</strong> {user.id}
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

// ============================================================================
// Example 4: Admin Layout with Auth
// ============================================================================

/**
 * Admin layout that shows user info and logout button
 */
export function AdminLayoutExample({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div className="admin-layout">
      <header>
        <div className="logo">Admin Panel</div>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

// ============================================================================
// Example 5: Conditional Rendering Based on Auth State
// ============================================================================

/**
 * Component that renders different content based on auth state
 */
export function ConditionalContentExample() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.email}!</h2>
          <p>You have access to the admin panel.</p>
        </div>
      ) : (
        <div>
          <h2>Access Denied</h2>
          <p>Please log in to access this content.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 6: Auth State Monitoring
// ============================================================================

/**
 * Component that monitors and logs auth state changes
 */
export function AuthStateMonitorExample() {
  const { isAuthenticated, user, loading } = useAuth();

  React.useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated,
      user,
      loading,
    });
  }, [isAuthenticated, user, loading]);

  return (
    <div className="auth-monitor">
      <h3>Auth State Monitor</h3>
      <pre>
        {JSON.stringify(
          {
            isAuthenticated,
            user,
            loading,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

// ============================================================================
// Example 7: Login with Error Handling
// ============================================================================

/**
 * Advanced login form with comprehensive error handling
 */
export function AdvancedLoginExample() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="advanced-login">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors((prev) => ({ ...prev, email: undefined }));
            }}
            disabled={loading}
          />
          {validationErrors.email && (
            <span className="error">{validationErrors.email}</span>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors((prev) => ({ ...prev, password: undefined }));
            }}
            disabled={loading}
          />
          {validationErrors.password && (
            <span className="error">{validationErrors.password}</span>
          )}
        </div>
        {error && <div className="error-banner">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Example 8: Session Persistence Demo
// ============================================================================

/**
 * Component that demonstrates session persistence across page reloads
 */
export function SessionPersistenceExample() {
  const { isAuthenticated, user, loading } = useAuth();
  const [reloadCount, setReloadCount] = React.useState(0);

  React.useEffect(() => {
    // Simulate page reload tracking
    const count = parseInt(sessionStorage.getItem('reloadCount') || '0', 10);
    setReloadCount(count);
    sessionStorage.setItem('reloadCount', String(count + 1));
  }, []);

  return (
    <div className="session-demo">
      <h3>Session Persistence Demo</h3>
      <p>Page loads: {reloadCount}</p>
      {loading ? (
        <p>Checking session...</p>
      ) : isAuthenticated ? (
        <div>
          <p>✓ Session restored successfully</p>
          <p>User: {user?.email}</p>
        </div>
      ) : (
        <p>No active session</p>
      )}
    </div>
  );
}
