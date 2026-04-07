# AnimationController Implementation

## Overview

The AnimationController is a high-performance scroll-based animation system that provides GPU-accelerated animations with automatic viewport-based pausing. It integrates with the ScrollManager for efficient scroll handling and uses the Web Animations API for smooth, performant animations.

## Features

✅ **requestAnimationFrame-based updates** - Smooth 60fps animations  
✅ **Viewport-based pausing** - Automatically pauses animations outside viewport to save resources  
✅ **GPU-accelerated** - Only uses CSS transforms and opacity (no layout-triggering properties)  
✅ **Lifecycle management** - Full control with pause, resume, and destroy methods  
✅ **ScrollManager integration** - Efficient scroll event handling with throttling  
✅ **Web Animations API** - Native browser animation support  
✅ **Intersection Observer** - Efficient viewport detection  

## Requirements Satisfied

- **Requirement 3.1**: Uses requestAnimationFrame for scroll-based animations
- **Requirement 3.2**: Only CSS transforms and opacity (validated at registration)
- **Requirement 3.3**: Pauses animations when elements are outside viewport
- **Requirement 3.4**: Uses requestAnimationFrame for animation updates
- **Requirement 3.5**: Batches DOM reads and writes for multiple animations

## Architecture

### Core Components

1. **AnimationController Class**
   - Manages multiple animation instances
   - Coordinates with ScrollManager for scroll events
   - Schedules updates via requestAnimationFrame
   - Batches DOM operations to avoid layout thrashing

2. **AnimationState**
   - Tracks individual animation state
   - Stores element reference and configuration
   - Manages Web Animations API animation instance
   - Handles Intersection Observer for viewport detection

3. **Integration with ScrollManager**
   - Subscribes to scroll events with 16ms throttling (60fps)
   - Uses batched scroll position reads
   - Automatically unsubscribes when no animations are active

### Animation Flow

```
User Scrolls
    ↓
ScrollManager (throttled to 16ms)
    ↓
AnimationController.handleScroll()
    ↓
scheduleUpdate() → requestAnimationFrame
    ↓
updateAnimations()
    ↓
1. Batch DOM reads (getBoundingClientRect)
2. Calculate progress for each animation
3. Update Web Animations API currentTime
```

### Viewport Detection

```
Element enters/exits viewport
    ↓
Intersection Observer callback
    ↓
Check intersection ratio vs threshold
    ↓
If outside viewport: Skip animation updates
If inside viewport: Resume animation updates
```

## API Reference

### AnimationController

#### `registerScrollAnimation(element, config)`

Registers a scroll-based animation for an element.

**Parameters:**
- `element: HTMLElement` - The element to animate
- `config: ScrollAnimationConfig` - Animation configuration

**Returns:** `AnimationHandle` - Handle for controlling the animation

**Example:**
```typescript
const handle = animationController.registerScrollAnimation(element, {
  keyframes: [
    { opacity: 0, transform: 'translateY(50px)', offset: 0 },
    { opacity: 1, transform: 'translateY(0)', offset: 1 }
  ],
  scrollRange: [0, 1],
  easing: 'ease-out',
  viewportThreshold: 0.1
});
```

#### `pauseAnimation(handle)`

Manually pauses an animation.

**Parameters:**
- `handle: AnimationHandle | string` - Animation handle or ID

#### `resumeAnimation(handle)`

Resumes a paused animation.

**Parameters:**
- `handle: AnimationHandle | string` - Animation handle or ID

#### `destroyAnimation(handle)`

Destroys an animation and cleans up resources.

**Parameters:**
- `handle: AnimationHandle | string` - Animation handle or ID

### ScrollAnimationConfig

Configuration object for scroll animations.

**Properties:**
- `keyframes: Keyframe[]` - Animation keyframes (only transform and opacity allowed)
- `scrollRange: [number, number]` - Scroll range as [start, end] from 0 to 1
- `easing?: string` - Easing function (default: 'linear')
- `viewportThreshold?: number` - Viewport visibility threshold 0-1 (default: 0.1)

### AnimationHandle

Handle for controlling an animation instance.

**Properties:**
- `id: string` - Unique animation ID

**Methods:**
- `pause()` - Pause the animation
- `resume()` - Resume the animation
- `destroy()` - Destroy the animation

## Usage Examples

### Basic Fade-In Animation

```typescript
import { animationController } from '@/lib/performance/AnimationController';

const element = document.querySelector('.fade-in');
const handle = animationController.registerScrollAnimation(element, {
  keyframes: [
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 1 }
  ],
  scrollRange: [0, 1],
  easing: 'ease-out'
});
```

### Slide-Up Animation

```typescript
const handle = animationController.registerScrollAnimation(element, {
  keyframes: [
    { transform: 'translateY(100px)', opacity: 0, offset: 0 },
    { transform: 'translateY(0)', opacity: 1, offset: 1 }
  ],
  scrollRange: [0, 0.8],
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  viewportThreshold: 0.2
});
```

### React Component Integration

```typescript
import { useEffect, useRef } from 'react';
import { animationController } from '@/lib/performance/AnimationController';

function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const handle = animationController.registerScrollAnimation(
      elementRef.current,
      {
        keyframes: [
          { opacity: 0, transform: 'translateY(50px)', offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 }
        ],
        scrollRange: [0, 1],
        easing: 'ease-out',
        viewportThreshold: 0.1
      }
    );

    // Cleanup on unmount
    return () => {
      handle.destroy();
    };
  }, []);

  return <div ref={elementRef}>Animated Content</div>;
}
```

### Manual Control

```typescript
const handle = animationController.registerScrollAnimation(element, config);

// Pause animation
handle.pause();

// Resume animation
handle.resume();

// Destroy animation
handle.destroy();
```

### Multiple Animations

```typescript
const elements = document.querySelectorAll('.animate-on-scroll');
const handles = Array.from(elements).map(element => 
  animationController.registerScrollAnimation(element, {
    keyframes: [
      { opacity: 0, transform: 'translateY(50px)', offset: 0 },
      { opacity: 1, transform: 'translateY(0)', offset: 1 }
    ],
    scrollRange: [0, 1],
    easing: 'ease-out'
  })
);

// Cleanup all animations
handles.forEach(handle => handle.destroy());
```

## Performance Characteristics

### Optimizations

1. **GPU Acceleration**
   - Only uses `transform` and `opacity` properties
   - Validated at registration time to prevent layout-triggering properties
   - Animations run on the GPU compositor thread

2. **Viewport-Based Pausing**
   - Automatically pauses animations outside viewport
   - Uses Intersection Observer for efficient detection
   - Saves CPU/GPU resources for off-screen elements

3. **Batched DOM Operations**
   - All DOM reads happen before DOM writes
   - Prevents layout thrashing
   - Efficient handling of multiple animations

4. **Throttled Scroll Handling**
   - Scroll events throttled to 16ms (60fps)
   - Uses requestAnimationFrame for updates
   - Prevents excessive calculations

5. **Web Animations API**
   - Native browser animation support
   - Better performance than JavaScript-based animations
   - Smooth interpolation handled by browser

### Performance Metrics

- **Frame Rate**: Maintains 60fps during scroll
- **CPU Usage**: Minimal - animations run on GPU
- **Memory**: Efficient - automatic cleanup when destroyed
- **Scroll Responsiveness**: 16ms throttle ensures smooth scrolling

## Validation

The AnimationController validates keyframes at registration time to ensure only performance-friendly properties are used:

**Allowed Properties:**
- `transform` - GPU-accelerated transforms
- `opacity` - GPU-accelerated opacity
- `offset` - Keyframe timing
- `easing` - Easing function
- `composite` - Composite operation

**Disallowed Properties:**
- Layout properties: `width`, `height`, `top`, `left`, `margin`, `padding`, etc.
- Paint properties: `color`, `background`, `border`, etc.

**Example Error:**
```typescript
// This will throw an error
animationController.registerScrollAnimation(element, {
  keyframes: [
    { width: '100px', offset: 0 }, // ❌ Error!
    { width: '200px', offset: 1 }
  ],
  scrollRange: [0, 1]
});

// Error: Invalid animation property "width". 
// Only CSS transforms and opacity are allowed for performance.
```

## Browser Compatibility

- **Web Animations API**: Chrome 36+, Firefox 48+, Safari 13.1+, Edge 79+
- **Intersection Observer**: Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+
- **requestAnimationFrame**: All modern browsers

For older browsers, animations will gracefully degrade:
- Without Intersection Observer: Animations always active (no viewport pausing)
- Without Web Animations API: Would need polyfill (not included)

## Best Practices

1. **Use Transforms Over Position**
   ```typescript
   // ✅ Good - GPU accelerated
   { transform: 'translateY(50px)' }
   
   // ❌ Bad - triggers layout
   { top: '50px' }
   ```

2. **Set Appropriate Viewport Thresholds**
   ```typescript
   // For large elements
   viewportThreshold: 0.1 // Pause when < 10% visible
   
   // For small elements
   viewportThreshold: 0.5 // Pause when < 50% visible
   ```

3. **Clean Up Animations**
   ```typescript
   // Always destroy animations when done
   useEffect(() => {
     const handle = animationController.registerScrollAnimation(...);
     return () => handle.destroy();
   }, []);
   ```

4. **Use Appropriate Scroll Ranges**
   ```typescript
   // Start animation partway through scroll
   scrollRange: [0.2, 0.8] // Animate from 20% to 80%
   ```

5. **Choose Efficient Easing Functions**
   ```typescript
   // Built-in easing functions are most efficient
   easing: 'ease-out' // ✅ Good
   easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // ✅ Good
   ```

## Troubleshooting

### Animation Not Running

1. Check if element is in viewport
2. Verify keyframes only use transform/opacity
3. Ensure scrollRange is valid [0-1]
4. Check if animation was paused manually

### Poor Performance

1. Reduce number of simultaneous animations
2. Increase viewport threshold to pause more aggressively
3. Simplify keyframes (fewer intermediate steps)
4. Check for layout-triggering properties

### Animation Jumpy or Stuttering

1. Verify scroll throttle is set to 16ms
2. Check for other scroll event listeners
3. Ensure no layout thrashing in other code
4. Profile with Chrome DevTools Performance tab

## Implementation Details

### Scroll Progress Calculation

The scroll progress is calculated based on the element's position relative to the viewport:

```typescript
// When element top is at viewport bottom: progress = 0
// When element bottom is at viewport top: progress = 1

const elementHeight = rect.height;
const scrollableDistance = viewportHeight + elementHeight;
const elementTopRelativeToViewportBottom = viewportHeight - rect.top;

let rawProgress = elementTopRelativeToViewportBottom / scrollableDistance;
rawProgress = Math.max(0, Math.min(1, rawProgress));

// Map to configured scroll range
const rangeSize = endRange - startRange;
const progress = startRange + (rawProgress * rangeSize);
```

### Animation Update Batching

To avoid layout thrashing, all DOM reads are batched before DOM writes:

```typescript
// 1. Batch all DOM reads
const measurements = animations.map(state => ({
  state,
  rect: state.element.getBoundingClientRect(),
  viewportHeight: window.innerHeight
}));

// 2. Process all animations (DOM writes)
for (const { state, rect, viewportHeight } of measurements) {
  // Calculate and update animation
}
```

## See Also

- [ScrollManager Implementation](./SCROLLMANAGER_IMPLEMENTATION.md)
- [AnimationController Examples](./AnimationController.example.ts)
- [Performance Optimization Spec](.kiro/specs/performance-optimization/)
