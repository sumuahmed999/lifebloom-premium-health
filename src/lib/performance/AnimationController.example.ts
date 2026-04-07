/**
 * AnimationController Usage Examples
 * 
 * This file demonstrates how to use the AnimationController for optimized
 * scroll-based animations with viewport-based pausing.
 */

import { animationController } from './AnimationController';

/**
 * Example 1: Simple fade-in animation on scroll
 * 
 * This creates a fade-in effect as the user scrolls down the page.
 * The element starts at opacity 0 and fades to opacity 1.
 */
export function setupFadeInAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 }
    ],
    scrollRange: [0, 1], // Animate from 0% to 100% of scroll range
    easing: 'ease-out',
    viewportThreshold: 0.1 // Pause when less than 10% visible
  });

  return handle;
}

/**
 * Example 2: Slide-up animation with transform
 * 
 * This creates a slide-up effect where the element moves from below
 * and fades in as the user scrolls.
 */
export function setupSlideUpAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { 
        transform: 'translateY(100px)', 
        opacity: 0, 
        offset: 0 
      },
      { 
        transform: 'translateY(0)', 
        opacity: 1, 
        offset: 1 
      }
    ],
    scrollRange: [0, 0.8], // Complete animation at 80% of scroll range
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    viewportThreshold: 0.2
  });

  return handle;
}

/**
 * Example 3: Scale and rotate animation
 * 
 * This creates a complex animation combining scale and rotation.
 * Only uses CSS transforms for optimal performance.
 */
export function setupScaleRotateAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { 
        transform: 'scale(0.5) rotate(0deg)', 
        opacity: 0, 
        offset: 0 
      },
      { 
        transform: 'scale(1) rotate(360deg)', 
        opacity: 1, 
        offset: 1 
      }
    ],
    scrollRange: [0.2, 1], // Start at 20% of scroll range
    easing: 'ease-in-out',
    viewportThreshold: 0.15
  });

  return handle;
}

/**
 * Example 4: Parallax effect
 * 
 * Creates a parallax scrolling effect by moving the element
 * at a different speed than the scroll.
 */
export function setupParallaxAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { transform: 'translateY(0px)', offset: 0 },
      { transform: 'translateY(-200px)', offset: 1 }
    ],
    scrollRange: [0, 1],
    easing: 'linear',
    viewportThreshold: 0.1
  });

  return handle;
}

/**
 * Example 5: Multi-stage animation with multiple keyframes
 * 
 * This demonstrates a more complex animation with multiple stages.
 */
export function setupMultiStageAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { 
        transform: 'translateX(-100px) scale(0.8)', 
        opacity: 0, 
        offset: 0 
      },
      { 
        transform: 'translateX(0) scale(1)', 
        opacity: 1, 
        offset: 0.5 
      },
      { 
        transform: 'translateX(50px) scale(0.9)', 
        opacity: 0.8, 
        offset: 1 
      }
    ],
    scrollRange: [0, 1],
    easing: 'ease-in-out',
    viewportThreshold: 0.1
  });

  return handle;
}

/**
 * Example 6: React component integration
 * 
 * This shows how to integrate AnimationController with a React component.
 */
export function useScrollAnimation() {
  // In a real React component, you would use useEffect and useRef
  
  const setupAnimation = (element: HTMLElement) => {
    const handle = animationController.registerScrollAnimation(element, {
      keyframes: [
        { opacity: 0, transform: 'translateY(50px)', offset: 0 },
        { opacity: 1, transform: 'translateY(0)', offset: 1 }
      ],
      scrollRange: [0, 1],
      easing: 'ease-out',
      viewportThreshold: 0.1
    });

    // Cleanup function
    return () => {
      handle.destroy();
    };
  };

  return setupAnimation;
}

/**
 * Example 7: Manual control of animation lifecycle
 * 
 * This demonstrates how to manually pause, resume, and destroy animations.
 */
export function setupControlledAnimation(element: HTMLElement) {
  const handle = animationController.registerScrollAnimation(element, {
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 }
    ],
    scrollRange: [0, 1],
    easing: 'linear'
  });

  // Pause animation after 2 seconds
  setTimeout(() => {
    handle.pause();
    console.log('Animation paused');
  }, 2000);

  // Resume animation after 4 seconds
  setTimeout(() => {
    handle.resume();
    console.log('Animation resumed');
  }, 4000);

  // Destroy animation after 6 seconds
  setTimeout(() => {
    handle.destroy();
    console.log('Animation destroyed');
  }, 6000);

  return handle;
}

/**
 * Example 8: Invalid animation (will throw error)
 * 
 * This demonstrates what NOT to do - using layout-triggering properties.
 * The AnimationController will throw an error to prevent performance issues.
 */
export function setupInvalidAnimation(element: HTMLElement) {
  try {
    // This will throw an error because 'width' is not allowed
    const handle = animationController.registerScrollAnimation(element, {
      keyframes: [
        { width: '100px', offset: 0 }, // ❌ Invalid - triggers layout
        { width: '200px', offset: 1 }  // ❌ Invalid - triggers layout
      ],
      scrollRange: [0, 1]
    });
    return handle;
  } catch (error) {
    console.error('Animation validation failed:', error);
    // Error: Invalid animation property "width". Only CSS transforms and opacity are allowed.
    return null;
  }
}

/**
 * Example 9: Batch multiple animations
 * 
 * This shows how to set up multiple animations efficiently.
 */
export function setupMultipleAnimations(elements: HTMLElement[]) {
  const handles = elements.map((element, index) => {
    return animationController.registerScrollAnimation(element, {
      keyframes: [
        { 
          opacity: 0, 
          transform: 'translateY(50px)', 
          offset: 0 
        },
        { 
          opacity: 1, 
          transform: 'translateY(0)', 
          offset: 1 
        }
      ],
      scrollRange: [0, 1],
      easing: 'ease-out',
      viewportThreshold: 0.1
    });
  });

  // Cleanup function to destroy all animations
  return () => {
    handles.forEach(handle => handle.destroy());
  };
}

/**
 * Example 10: Staggered animations
 * 
 * This creates a staggered effect where elements animate one after another.
 */
export function setupStaggeredAnimations(elements: HTMLElement[]) {
  const handles = elements.map((element, index) => {
    const delay = index * 0.1; // 10% delay between each element
    
    return animationController.registerScrollAnimation(element, {
      keyframes: [
        { 
          opacity: 0, 
          transform: 'translateX(-50px)', 
          offset: 0 
        },
        { 
          opacity: 1, 
          transform: 'translateX(0)', 
          offset: 1 
        }
      ],
      scrollRange: [delay, Math.min(delay + 0.5, 1)], // Stagger the scroll range
      easing: 'ease-out',
      viewportThreshold: 0.1
    });
  });

  return handles;
}
