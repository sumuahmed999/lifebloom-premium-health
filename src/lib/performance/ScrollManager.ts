/**
 * ScrollManager - Optimized scroll event handling with passive listeners and batching
 * 
 * Features:
 * - Passive scroll event listeners for better performance
 * - Throttled scroll callbacks (16ms default for 60fps)
 * - Batched scroll position reads to avoid layout thrashing
 * - DOM measurement batching to separate reads from writes
 * 
 * Requirements: 3.1, 8.1, 8.2, 8.4
 */

export interface ScrollOptions {
  /** Throttle interval in ms (default: 16) */
  throttle?: number;
  /** Use passive listener (default: true) */
  passive?: boolean;
}

export interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
}

export type ScrollCallback = (position: ScrollPosition) => void;
export type MeasurementFn = () => any;

interface ScrollListener {
  callback: ScrollCallback;
  options: Required<ScrollOptions>;
  lastCallTime: number;
  throttleTimeout: number | null;
}

export class ScrollManager {
  private listeners: ScrollListener[] = [];
  private currentPosition: ScrollPosition = {
    x: 0,
    y: 0,
    direction: 'none'
  };
  private previousPosition = { x: 0, y: 0 };
  private isListening = false;
  private rafId: number | null = null;
  private pendingUpdate = false;

  /**
   * Register a scroll listener with throttling and passive event handling
   * 
   * @param callback - Function to call on scroll events
   * @param options - Scroll options (throttle, passive)
   * @returns Unsubscribe function
   */
  onScroll(callback: ScrollCallback, options: ScrollOptions = {}): () => void {
    const listener: ScrollListener = {
      callback,
      options: {
        throttle: options.throttle ?? 16,
        passive: options.passive ?? true
      },
      lastCallTime: 0,
      throttleTimeout: null
    };

    this.listeners.push(listener);

    // Start listening if this is the first listener
    if (!this.isListening) {
      this.startListening();
    }

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        // Clear any pending throttle timeout
        if (listener.throttleTimeout !== null) {
          clearTimeout(listener.throttleTimeout);
        }
        this.listeners.splice(index, 1);
      }

      // Stop listening if no more listeners
      if (this.listeners.length === 0) {
        this.stopListening();
      }
    };
  }

  /**
   * Get current scroll position (batched read)
   * This method batches the DOM read to avoid layout thrashing
   * 
   * @returns Current scroll position with direction
   */
  getScrollPosition(): ScrollPosition {
    return { ...this.currentPosition };
  }

  /**
   * Batch multiple DOM measurements to avoid layout thrashing
   * All measurements are executed in a single read phase
   * 
   * @param measurements - Array of measurement functions
   * @returns Array of measurement results
   */
  measureBatch(measurements: MeasurementFn[]): any[] {
    // Execute all measurements in a single batch
    // This ensures all DOM reads happen before any writes
    return measurements.map(fn => fn());
  }

  /**
   * Start listening to scroll events
   */
  private startListening(): void {
    if (this.isListening || typeof window === 'undefined') {
      return;
    }

    this.isListening = true;

    // Initialize current position
    this.updateScrollPosition();

    // Add passive scroll listener for better performance
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Stop listening to scroll events
   */
  private stopListening(): void {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;

    window.removeEventListener('scroll', this.handleScroll);

    // Cancel any pending RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Clear all throttle timeouts
    this.listeners.forEach(listener => {
      if (listener.throttleTimeout !== null) {
        clearTimeout(listener.throttleTimeout);
        listener.throttleTimeout = null;
      }
    });
  }

  /**
   * Handle scroll events
   */
  private handleScroll = (): void => {
    // Use RAF to batch scroll position updates
    if (!this.pendingUpdate) {
      this.pendingUpdate = true;
      this.rafId = requestAnimationFrame(() => {
        this.updateScrollPosition();
        this.notifyListeners();
        this.pendingUpdate = false;
      });
    }
  };

  /**
   * Update scroll position and calculate direction
   */
  private updateScrollPosition(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Batch DOM reads
    const x = window.scrollX || window.pageXOffset;
    const y = window.scrollY || window.pageYOffset;

    // Calculate direction
    let direction: ScrollPosition['direction'] = 'none';
    
    if (y > this.previousPosition.y) {
      direction = 'down';
    } else if (y < this.previousPosition.y) {
      direction = 'up';
    } else if (x > this.previousPosition.x) {
      direction = 'right';
    } else if (x < this.previousPosition.x) {
      direction = 'left';
    }

    this.currentPosition = { x, y, direction };
    this.previousPosition = { x, y };
  }

  /**
   * Notify all listeners with throttling
   */
  private notifyListeners(): void {
    const now = performance.now();

    this.listeners.forEach(listener => {
      const timeSinceLastCall = now - listener.lastCallTime;

      // Check if enough time has passed since last call
      if (timeSinceLastCall >= listener.options.throttle) {
        listener.lastCallTime = now;
        listener.callback(this.currentPosition);
      } else {
        // Schedule callback for later if not already scheduled
        if (listener.throttleTimeout === null) {
          const remainingTime = listener.options.throttle - timeSinceLastCall;
          listener.throttleTimeout = window.setTimeout(() => {
            listener.throttleTimeout = null;
            listener.lastCallTime = performance.now();
            listener.callback(this.currentPosition);
          }, remainingTime);
        }
      }
    });
  }

  /**
   * Cleanup and remove all listeners
   */
  destroy(): void {
    this.stopListening();
    this.listeners = [];
  }
}

// Export singleton instance
export const scrollManager = new ScrollManager();
