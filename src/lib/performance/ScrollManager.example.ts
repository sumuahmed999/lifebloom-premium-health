/**
 * ScrollManager Usage Examples
 * 
 * This file demonstrates how to use the ScrollManager utility
 * for optimized scroll event handling.
 */

import { scrollManager, ScrollManager } from './ScrollManager';

// Example 1: Basic scroll listener with default throttling (16ms)
export function basicScrollExample() {
  const unsubscribe = scrollManager.onScroll((position) => {
    console.log('Scroll position:', position);
    console.log('Direction:', position.direction);
  });

  // Clean up when done
  return unsubscribe;
}

// Example 2: Custom throttle interval (e.g., 100ms for less frequent updates)
export function customThrottleExample() {
  const unsubscribe = scrollManager.onScroll(
    (position) => {
      console.log('Throttled scroll:', position.y);
    },
    { throttle: 100 }
  );

  return unsubscribe;
}

// Example 3: Get current scroll position (batched read)
export function getCurrentPositionExample() {
  const position = scrollManager.getScrollPosition();
  console.log('Current position:', position);
  return position;
}

// Example 4: Batch DOM measurements to avoid layout thrashing
export function batchMeasurementsExample() {
  const elements = document.querySelectorAll('.animated-element');

  // BAD: Multiple DOM reads interspersed with writes (causes layout thrashing)
  // elements.forEach(el => {
  //   const height = el.getBoundingClientRect().height; // Read
  //   el.style.transform = `translateY(${height}px)`; // Write
  // });

  // GOOD: Batch all reads, then do all writes
  const measurements = scrollManager.measureBatch([
    () => elements[0]?.getBoundingClientRect(),
    () => elements[1]?.getBoundingClientRect(),
    () => elements[2]?.getBoundingClientRect(),
  ]);

  // Now do all writes
  measurements.forEach((rect, index) => {
    if (rect && elements[index]) {
      const element = elements[index] as HTMLElement;
      element.style.transform = `translateY(${rect.height}px)`;
    }
  });
}

// Example 5: React component integration
export function reactComponentExample() {
  // In a React component:
  /*
  import { useEffect, useState } from 'react';
  import { scrollManager } from '@/lib/performance/ScrollManager';

  function ScrollTracker() {
    const [scrollY, setScrollY] = useState(0);
    const [direction, setDirection] = useState('none');

    useEffect(() => {
      const unsubscribe = scrollManager.onScroll((position) => {
        setScrollY(position.y);
        setDirection(position.direction);
      });

      return unsubscribe; // Cleanup on unmount
    }, []);

    return (
      <div>
        <p>Scroll Y: {scrollY}px</p>
        <p>Direction: {direction}</p>
      </div>
    );
  }
  */
}

// Example 6: Multiple listeners with different throttle rates
export function multipleListenersExample() {
  // Fast updates for critical UI (16ms = 60fps)
  const unsubscribe1 = scrollManager.onScroll(
    (position) => {
      // Update parallax effect
      updateParallax(position.y);
    },
    { throttle: 16 }
  );

  // Slower updates for less critical features (100ms)
  const unsubscribe2 = scrollManager.onScroll(
    (position) => {
      // Update scroll progress indicator
      updateScrollProgress(position.y);
    },
    { throttle: 100 }
  );

  // Clean up both listeners
  return () => {
    unsubscribe1();
    unsubscribe2();
  };
}

// Example 7: Scroll-based animation with RAF
export function scrollAnimationExample() {
  const element = document.querySelector('.animated-header') as HTMLElement;
  
  const unsubscribe = scrollManager.onScroll((position) => {
    if (!element) return;

    // Calculate opacity based on scroll position
    const opacity = Math.max(0, 1 - position.y / 300);
    
    // Use transform and opacity (GPU-accelerated properties)
    element.style.opacity = opacity.toString();
    element.style.transform = `translateY(${position.y * 0.5}px)`;
  });

  return unsubscribe;
}

// Example 8: Creating a custom instance (not using singleton)
export function customInstanceExample() {
  // Create a dedicated instance for a specific scroll container
  const customScrollManager = new ScrollManager();

  const unsubscribe = customScrollManager.onScroll((position) => {
    console.log('Custom scroll manager:', position);
  });

  // Clean up
  return () => {
    unsubscribe();
    customScrollManager.destroy();
  };
}

// Helper functions for examples
function updateParallax(scrollY: number) {
  // Parallax implementation
  console.log('Updating parallax:', scrollY);
}

function updateScrollProgress(scrollY: number) {
  // Progress indicator implementation
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollY / maxScroll) * 100;
  console.log('Scroll progress:', progress + '%');
}
