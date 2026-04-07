import { lazy, LazyExoticComponent, ComponentType, ReactNode } from 'react';

export interface LazyLoadOptions {
  threshold?: number;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ error: Error }>;
}

export class LazyComponentLoader {
  private intersectionObserver: IntersectionObserver | null = null;
  private preloadedComponents = new Set<string>();

  /**
   * Load a component lazily with optional viewport detection
   */
  loadComponent<T = any>(
    importFn: () => Promise<{ default: ComponentType<T> }>,
    options: LazyLoadOptions = {}
  ): LazyExoticComponent<ComponentType<T>> {
    const { threshold = 200 } = options;

    // Create lazy component using React.lazy
    const LazyComponent = lazy(importFn);

    // Set up Intersection Observer for viewport detection if threshold is specified
    if (threshold > 0 && typeof IntersectionObserver !== 'undefined') {
      this.setupIntersectionObserver(threshold);
    }

    return LazyComponent;
  }

  /**
   * Preload a component before it's needed
   */
  async preloadComponent(importFn: () => Promise<any>): Promise<void> {
    const componentKey = importFn.toString();
    
    // Skip if already preloaded
    if (this.preloadedComponents.has(componentKey)) {
      return;
    }

    try {
      await importFn();
      this.preloadedComponents.add(componentKey);
    } catch (error) {
      console.error('Failed to preload component:', error);
      throw error;
    }
  }

  /**
   * Set up Intersection Observer for viewport detection
   */
  private setupIntersectionObserver(threshold: number): void {
    if (this.intersectionObserver) {
      return;
    }

    // Convert pixel threshold to rootMargin
    const rootMargin = `${threshold}px`;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Component is entering viewport threshold
            // The actual loading is handled by React.lazy
          }
        });
      },
      {
        rootMargin,
        threshold: 0,
      }
    );
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.preloadedComponents.clear();
  }
}

// Export singleton instance
export const lazyComponentLoader = new LazyComponentLoader();
