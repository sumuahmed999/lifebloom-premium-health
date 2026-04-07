/**
 * PerformanceMonitor - Tracks Core Web Vitals and performance metrics
 * 
 * Monitors:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTI (Time to Interactive)
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 */

export type MetricType = 'fcp' | 'lcp' | 'tti' | 'cls' | 'fid';

export interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  tti: number | null;
  cls: number | null;
  fid: number | null;
}

interface MetricThreshold {
  good: number;
  needsImprovement: number;
}

interface ThresholdCallback {
  metric: MetricType;
  threshold: number;
  callback: (value: number) => void;
}

const METRIC_THRESHOLDS: Record<MetricType, MetricThreshold> = {
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  tti: { good: 3800, needsImprovement: 7300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 }
};

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fcp: null,
    lcp: null,
    tti: null,
    cls: null,
    fid: null
  };

  private thresholdCallbacks: ThresholdCallback[] = [];
  private observers: PerformanceObserver[] = [];
  private isStarted = false;

  /**
   * Start monitoring performance metrics
   */
  start(): void {
    if (this.isStarted) {
      console.warn('PerformanceMonitor already started');
      return;
    }

    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    this.isStarted = true;
    this.observeFCP();
    this.observeLCP();
    this.observeCLS();
    this.observeFID();
    this.observeTTI();
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.checkThreshold('fcp', entry.startTime);
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.error('Error observing FCP:', error);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.checkThreshold('lcp', lastEntry.startTime);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.error('Error observing LCP:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cls = clsValue;
            this.checkThreshold('cls', clsValue);
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.error('Error observing CLS:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          const fidEntry = entry as any;
          if (fidEntry.processingStart && fidEntry.startTime) {
            const fid = fidEntry.processingStart - fidEntry.startTime;
            this.metrics.fid = fid;
            this.checkThreshold('fid', fid);
          }
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.error('Error observing FID:', error);
    }
  }

  /**
   * Observe Time to Interactive (approximation)
   */
  private observeTTI(): void {
    try {
      // TTI is approximated using load event + long tasks
      if (document.readyState === 'complete') {
        this.calculateTTI();
      } else {
        window.addEventListener('load', () => this.calculateTTI());
      }
    } catch (error) {
      console.error('Error observing TTI:', error);
    }
  }

  /**
   * Calculate TTI approximation
   */
  private calculateTTI(): void {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      // Approximate TTI as domInteractive + time to first idle
      const tti = navigationEntry.domInteractive;
      this.metrics.tti = tti;
      this.checkThreshold('tti', tti);
    }
  }

  /**
   * Check if metric exceeds threshold and trigger callbacks
   */
  private checkThreshold(metric: MetricType, value: number): void {
    const threshold = METRIC_THRESHOLDS[metric];
    
    // Log warning if exceeds "good" threshold
    if (value > threshold.good) {
      const rating = value > threshold.needsImprovement ? 'poor' : 'needs-improvement';
      console.warn(
        `Performance Warning: ${metric.toUpperCase()} = ${value.toFixed(2)}ms (${rating})`,
        `Threshold: ${threshold.good}ms`
      );
    }

    // Trigger registered callbacks
    this.thresholdCallbacks
      .filter(cb => cb.metric === metric && value > cb.threshold)
      .forEach(cb => cb.callback(value));
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Register callback for metric threshold exceeded
   */
  onThresholdExceeded(
    metric: MetricType,
    threshold: number,
    callback: (value: number) => void
  ): () => void {
    const entry: ThresholdCallback = { metric, threshold, callback };
    this.thresholdCallbacks.push(entry);

    // Return unsubscribe function
    return () => {
      const index = this.thresholdCallbacks.indexOf(entry);
      if (index > -1) {
        this.thresholdCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Log all metrics to console
   */
  logMetrics(): void {
    console.group('Performance Metrics');
    console.log('FCP (First Contentful Paint):', this.formatMetric(this.metrics.fcp));
    console.log('LCP (Largest Contentful Paint):', this.formatMetric(this.metrics.lcp));
    console.log('TTI (Time to Interactive):', this.formatMetric(this.metrics.tti));
    console.log('CLS (Cumulative Layout Shift):', this.formatMetric(this.metrics.cls, false));
    console.log('FID (First Input Delay):', this.formatMetric(this.metrics.fid));
    console.groupEnd();
  }

  /**
   * Format metric for display
   */
  private formatMetric(value: number | null, addMs = true): string {
    if (value === null) {
      return 'Not measured';
    }
    return addMs ? `${value.toFixed(2)}ms` : value.toFixed(3);
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.thresholdCallbacks = [];
    this.isStarted = false;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
