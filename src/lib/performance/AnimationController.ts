/**
 * AnimationController - Optimized scroll-based animation system
 * 
 * Features:
 * - requestAnimationFrame-based scroll animations
 * - Viewport-based animation pausing using Intersection Observer
 * - Only uses CSS transforms and opacity (GPU-accelerated)
 * - Animation lifecycle management (pause, resume, destroy)
 * - Integration with ScrollManager for efficient scroll handling
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { scrollManager, type ScrollPosition } from './ScrollManager';

export interface ScrollAnimationConfig {
  /** Animation keyframes using CSS transforms and opacity */
  keyframes: Keyframe[];
  /** Scroll range for animation (0-1) where 0 is start, 1 is end */
  scrollRange: [number, number];
  /** Easing function (default: 'linear') */
  easing?: string;
  /** Viewport threshold to pause (default: 0.1 = 10% visible) */
  viewportThreshold?: number;
}

export interface AnimationHandle {
  id: string;
  pause(): void;
  resume(): void;
  destroy(): void;
}

interface AnimationState {
  id: string;
  element: HTMLElement;
  config: ScrollAnimationConfig;
  isActive: boolean;
  isPaused: boolean;
  currentProgress: number; // 0-1
  lastFrameTime: number;
  animation: Animation | null;
  intersectionObserver: IntersectionObserver | null;
}

export class AnimationController {
  private animations = new Map<string, AnimationState>();
  private nextId = 0;
  private rafId: number | null = null;
  private scrollUnsubscribe: (() => void) | null = null;

  /**
   * Register a scroll-based animation
   * 
   * @param element - HTML element to animate
   * @param config - Animation configuration
   * @returns Animation handle for lifecycle control
   */
  registerScrollAnimation(
    element: HTMLElement,
    config: ScrollAnimationConfig
  ): AnimationHandle {
    // Validate keyframes only use transforms and opacity
    this.validateKeyframes(config.keyframes);

    const id = `anim-${this.nextId++}`;
    
    // Create animation state
    const state: AnimationState = {
      id,
      element,
      config: {
        ...config,
        easing: config.easing ?? 'linear',
        viewportThreshold: config.viewportThreshold ?? 0.1
      },
      isActive: true,
      isPaused: false,
      currentProgress: 0,
      lastFrameTime: 0,
      animation: null,
      intersectionObserver: null
    };

    // Create Web Animations API animation
    state.animation = element.animate(config.keyframes, {
      duration: 1000, // Duration doesn't matter, we'll control via currentTime
      easing: state.config.easing,
      fill: 'both'
    });
    
    // Pause immediately - we'll control it via scroll
    state.animation.pause();

    // Set up Intersection Observer for viewport-based pausing
    this.setupIntersectionObserver(state);

    // Store animation state
    this.animations.set(id, state);

    // Start scroll listening if this is the first animation
    if (this.animations.size === 1) {
      this.startScrollListening();
    }

    // Create and return handle
    const handle: AnimationHandle = {
      id,
      pause: () => this.pauseAnimation(id),
      resume: () => this.resumeAnimation(id),
      destroy: () => this.destroyAnimation(id)
    };

    return handle;
  }

  /**
   * Pause an animation
   * 
   * @param handleOrId - Animation handle or ID
   */
  pauseAnimation(handleOrId: AnimationHandle | string): void {
    const id = typeof handleOrId === 'string' ? handleOrId : handleOrId.id;
    const state = this.animations.get(id);
    
    if (state && !state.isPaused) {
      state.isPaused = true;
    }
  }

  /**
   * Resume a paused animation
   * 
   * @param handleOrId - Animation handle or ID
   */
  resumeAnimation(handleOrId: AnimationHandle | string): void {
    const id = typeof handleOrId === 'string' ? handleOrId : handleOrId.id;
    const state = this.animations.get(id);
    
    if (state && state.isPaused) {
      state.isPaused = false;
      
      // Trigger an update on next frame
      if (this.rafId === null) {
        this.scheduleUpdate();
      }
    }
  }

  /**
   * Destroy an animation and cleanup resources
   * 
   * @param handleOrId - Animation handle or ID
   */
  destroyAnimation(handleOrId: AnimationHandle | string): void {
    const id = typeof handleOrId === 'string' ? handleOrId : handleOrId.id;
    const state = this.animations.get(id);
    
    if (state) {
      // Cancel animation
      if (state.animation) {
        state.animation.cancel();
      }
      
      // Disconnect intersection observer
      if (state.intersectionObserver) {
        state.intersectionObserver.disconnect();
      }
      
      // Mark as inactive
      state.isActive = false;
      
      // Remove from map
      this.animations.delete(id);
      
      // Stop scroll listening if no more animations
      if (this.animations.size === 0) {
        this.stopScrollListening();
      }
    }
  }

  /**
   * Validate that keyframes only use transforms and opacity
   * Throws error if layout-triggering properties are used
   */
  private validateKeyframes(keyframes: Keyframe[]): void {
    const allowedProperties = new Set([
      'transform',
      'opacity',
      'offset',
      'easing',
      'composite'
    ]);

    for (const keyframe of keyframes) {
      const properties = Object.keys(keyframe);
      
      for (const prop of properties) {
        if (!allowedProperties.has(prop)) {
          throw new Error(
            `Invalid animation property "${prop}". ` +
            `Only CSS transforms and opacity are allowed for performance. ` +
            `Avoid layout-triggering properties like width, height, top, left, etc.`
          );
        }
      }
    }
  }

  /**
   * Set up Intersection Observer for viewport-based pausing
   */
  private setupIntersectionObserver(state: AnimationState): void {
    if (typeof IntersectionObserver === 'undefined') {
      // IntersectionObserver not supported, animation will always be active
      return;
    }

    const threshold = state.config.viewportThreshold!;
    
    state.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === state.element) {
            if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
              // Element is in viewport - resume if not manually paused
              if (state.isActive && !state.isPaused) {
                this.scheduleUpdate();
              }
            } else {
              // Element is outside viewport - pause to save resources
              // This is automatic pausing, different from manual pause
              // We don't set isPaused flag, just skip updates
            }
          }
        });
      },
      {
        threshold: [0, threshold, 1]
      }
    );

    state.intersectionObserver.observe(state.element);
  }

  /**
   * Start listening to scroll events
   */
  private startScrollListening(): void {
    if (this.scrollUnsubscribe) {
      return;
    }

    // Subscribe to scroll events via ScrollManager
    this.scrollUnsubscribe = scrollManager.onScroll(
      (position) => this.handleScroll(position),
      { throttle: 16 } // 60fps
    );

    // Initial update
    this.scheduleUpdate();
  }

  /**
   * Stop listening to scroll events
   */
  private stopScrollListening(): void {
    if (this.scrollUnsubscribe) {
      this.scrollUnsubscribe();
      this.scrollUnsubscribe = null;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Handle scroll events
   */
  private handleScroll(position: ScrollPosition): void {
    this.scheduleUpdate();
  }

  /**
   * Schedule an animation update on next frame
   */
  private scheduleUpdate(): void {
    if (this.rafId !== null) {
      return; // Update already scheduled
    }

    this.rafId = requestAnimationFrame(() => {
      this.updateAnimations();
      this.rafId = null;
    });
  }

  /**
   * Update all active animations based on scroll position
   * Uses requestAnimationFrame for smooth 60fps updates
   */
  private updateAnimations(): void {
    const now = performance.now();
    const scrollPosition = scrollManager.getScrollPosition();
    
    // Batch all DOM reads first (avoid layout thrashing)
    const measurements = Array.from(this.animations.values())
      .filter(state => state.isActive && !state.isPaused)
      .map(state => ({
        state,
        rect: state.element.getBoundingClientRect(),
        viewportHeight: window.innerHeight
      }));

    // Then process all animations (DOM writes)
    for (const { state, rect, viewportHeight } of measurements) {
      // Check if element is in viewport
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
      
      if (!isInViewport) {
        // Skip animation updates for elements outside viewport
        continue;
      }

      // Calculate scroll progress based on element position
      const progress = this.calculateScrollProgress(
        state,
        rect,
        viewportHeight,
        scrollPosition.y
      );

      // Update animation progress
      if (progress !== state.currentProgress) {
        state.currentProgress = progress;
        
        if (state.animation) {
          // Update animation currentTime based on progress
          // Animation duration is 1000ms, so progress 0-1 maps to 0-1000ms
          state.animation.currentTime = progress * 1000;
        }
      }

      state.lastFrameTime = now;
    }
  }

  /**
   * Calculate scroll progress for an animation
   * 
   * @param state - Animation state
   * @param rect - Element bounding rect
   * @param viewportHeight - Viewport height
   * @param scrollY - Current scroll Y position
   * @returns Progress value between 0 and 1
   */
  private calculateScrollProgress(
    state: AnimationState,
    rect: DOMRect,
    viewportHeight: number,
    scrollY: number
  ): number {
    const [startRange, endRange] = state.config.scrollRange;
    
    // Calculate element's position relative to viewport
    // When element top is at viewport bottom: progress = 0
    // When element bottom is at viewport top: progress = 1
    const elementHeight = rect.height;
    const scrollableDistance = viewportHeight + elementHeight;
    const elementTopRelativeToViewportBottom = viewportHeight - rect.top;
    
    // Raw progress from 0 to 1 based on element position
    let rawProgress = elementTopRelativeToViewportBottom / scrollableDistance;
    
    // Clamp to 0-1
    rawProgress = Math.max(0, Math.min(1, rawProgress));
    
    // Map to configured scroll range
    const rangeSize = endRange - startRange;
    const progress = startRange + (rawProgress * rangeSize);
    
    // Clamp final progress to 0-1
    return Math.max(0, Math.min(1, progress));
  }

  /**
   * Cleanup and destroy all animations
   */
  destroy(): void {
    // Destroy all animations
    const animationIds = Array.from(this.animations.keys());
    animationIds.forEach(id => this.destroyAnimation(id));
    
    // Stop scroll listening
    this.stopScrollListening();
  }
}

// Export singleton instance
export const animationController = new AnimationController();
