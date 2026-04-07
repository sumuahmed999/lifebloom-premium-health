import { ReactNode } from 'react';

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

/**
 * Default loading fallback component for lazy-loaded components
 */
export const LoadingFallback = ({ 
  message = 'Loading...', 
  className = '' 
}: LoadingFallbackProps) => {
  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

/**
 * Page-level loading fallback for route components
 */
export const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-base text-muted-foreground">Loading page...</p>
      </div>
    </div>
  );
};

/**
 * Error boundary fallback component
 */
interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError?: () => void;
}

export const ErrorBoundaryFallback = ({ 
  error, 
  resetError 
}: ErrorBoundaryFallbackProps) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <div className="max-w-md w-full bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-destructive mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        {resetError && (
          <button
            onClick={resetError}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};
