# Performance Optimization Utilities

## LazyComponentLoader

A utility for implementing lazy loading of React components with viewport detection support.

### Features

- **Dynamic Imports**: Uses React.lazy() for code splitting
- **Viewport Detection**: Optional Intersection Observer integration for loading components when they enter viewport
- **Preloading**: Ability to prefetch components before they're needed
- **Configurable Threshold**: Customize viewport detection distance

### Usage

#### Basic Lazy Loading

```typescript
import { lazyComponentLoader } from '@/lib/performance/LazyComponentLoader';

// Load component lazily
const MyComponent = lazyComponentLoader.loadComponent(
  () => import('./MyComponent')
);

// Use with Suspense
<Suspense fallback={<LoadingFallback />}>
  <MyComponent />
</Suspense>
```

#### With Custom Options

```typescript
const MyComponent = lazyComponentLoader.loadComponent(
  () => import('./MyComponent'),
  {
    threshold: 300, // Load when 300px from viewport
    fallback: <CustomLoader />,
  }
);
```

#### Preloading Components

```typescript
// Preload on hover or focus
const handleMouseEnter = () => {
  lazyComponentLoader.preloadComponent(() => import('./HeavyComponent'));
};

<button onMouseEnter={handleMouseEnter}>
  Show Heavy Component
</button>
```

### Route-Based Code Splitting

The application now uses lazy loading for all route components:

```typescript
// App.tsx
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Wrapped in Suspense
<Suspense fallback={<PageLoadingFallback />}>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Suspense>
```

## Loading Fallback Components

Three loading fallback components are available:

### LoadingFallback
General-purpose loading indicator for lazy-loaded components.

```typescript
<LoadingFallback message="Loading content..." />
```

### PageLoadingFallback
Full-page loading indicator for route-level lazy loading.

```typescript
<Suspense fallback={<PageLoadingFallback />}>
  <Routes>...</Routes>
</Suspense>
```

### ErrorBoundaryFallback
Error display component with retry functionality.

```typescript
<ErrorBoundaryFallback 
  error={error} 
  resetError={() => window.location.reload()} 
/>
```

## Vite Configuration

The Vite build is configured for optimal code splitting:

- **Vendor Chunks**: Separate chunks for React, UI libraries, React Query, and Supabase
- **Route Splitting**: Automatic code splitting at route boundaries
- **Chunk Size Limit**: 500KB warning threshold

### Build Output Example

```
dist/assets/NotFound-CjRq9XUs.js      0.66 kB
dist/assets/Admin-3vxzqRs-.js        20.97 kB
dist/assets/Index-BL4grzN2.js        45.08 kB
dist/assets/query-vendor-BiuhTGQu.js 25.99 kB
dist/assets/react-vendor-igCKWm7b.js 160.03 kB
```

## Performance Benefits

- **Reduced Initial Bundle**: Only critical code loads on first page load
- **Faster Time to Interactive**: Smaller initial JavaScript payload
- **Better Caching**: Vendor chunks cached separately from app code
- **On-Demand Loading**: Components load only when needed

## ImageLoader Service

A service for optimizing image loading with modern formats and responsive sizing.

### Features

- **WebP Support Detection**: Automatically detects browser WebP support
- **Responsive Sources**: Generates srcset for multiple viewport widths
- **Critical Image Preloading**: Preloads above-the-fold images
- **Format Fallbacks**: Provides JPEG/PNG fallback for unsupported browsers

### Usage

#### Generate Responsive Sources

```typescript
import { imageLoader } from '@/lib/performance/ImageLoader';

const sources = imageLoader.getResponsiveSources(
  '/images/hero.jpg',
  [320, 640, 768, 1024, 1280, 1536]
);

// Returns array of sources with WebP and fallback formats
// [
//   { srcSet: '/images/hero.jpg?w=320&format=webp 320w, ...', type: 'image/webp' },
//   { srcSet: '/images/hero.jpg?w=320&format=jpeg 320w, ...', type: 'image/jpeg' }
// ]
```

#### Check WebP Support

```typescript
if (imageLoader.supportsWebP()) {
  // Browser supports WebP
}
```

#### Preload Critical Images

```typescript
// Preload hero image for faster LCP
imageLoader.preloadImage('/images/hero.jpg');
```

## OptimizedImage Component

A React component that implements all image optimization best practices.

### Features

- **Lazy Loading**: Uses Intersection Observer to load images when approaching viewport
- **Responsive Sizing**: Automatically generates srcset for different viewport widths
- **WebP with Fallback**: Serves WebP to supported browsers, JPEG/PNG to others
- **Blur Placeholder**: Shows blur effect during image loading
- **Priority Loading**: Disables lazy loading for above-fold images
- **Error Handling**: Displays fallback UI on image load failure

### Usage

#### Basic Usage

```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  className="w-full h-96"
/>
```

#### With Priority Loading (Above-Fold)

```typescript
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  priority={true}  // Preloads and loads eagerly
  lazy={false}     // Disables lazy loading
  className="w-full h-96"
/>
```

#### With Blur Placeholder

```typescript
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // Tiny base64 image
  className="w-full h-96"
/>
```

#### With Custom Sizes

```typescript
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width={1200}
  height={800}
  className="w-full h-96"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | required | Alt text for accessibility |
| `sizes` | `string` | `'100vw'` | Responsive sizes attribute |
| `lazy` | `boolean` | `true` | Enable lazy loading |
| `placeholder` | `string` | `undefined` | Blur placeholder image (base64) |
| `priority` | `boolean` | `false` | Priority loading for above-fold images |
| `className` | `string` | `''` | CSS classes |
| `width` | `number` | `undefined` | Image width |
| `height` | `number` | `undefined` | Image height |

### Behavior

1. **Priority Images**: Immediately preloaded and rendered with `loading="eager"`
2. **Lazy Images**: Load when within 200px of viewport using Intersection Observer
3. **Format Selection**: Automatically serves WebP to supported browsers
4. **Placeholder**: Shows blur effect during loading if placeholder provided
5. **Error Handling**: Displays "Image failed to load" message on error

## ScrollManager

A utility for optimized scroll event handling with passive listeners, throttling, and DOM measurement batching.

### Features

- **Passive Event Listeners**: Uses passive scroll listeners for better performance (Requirement 8.1)
- **Throttling**: Throttles scroll callbacks to 16ms (60fps) by default (Requirements 3.1, 8.2)
- **Batched Reads**: Batches scroll position reads to avoid layout thrashing (Requirement 8.4)
- **DOM Measurement Batching**: Separates DOM reads from writes to prevent layout thrashing
- **Direction Tracking**: Automatically tracks scroll direction (up, down, left, right)
- **Multiple Listeners**: Supports multiple listeners with different throttle rates
- **Automatic Cleanup**: Cleans up listeners and timers on unsubscribe

### Usage

#### Basic Scroll Listener

```typescript
import { scrollManager } from '@/lib/performance/ScrollManager';

// Register scroll listener with default 16ms throttle
const unsubscribe = scrollManager.onScroll((position) => {
  console.log('Scroll Y:', position.y);
  console.log('Direction:', position.direction);
});

// Clean up when done
unsubscribe();
```

#### Custom Throttle Interval

```typescript
// Slower updates for less critical features (100ms)
const unsubscribe = scrollManager.onScroll(
  (position) => {
    updateScrollProgress(position.y);
  },
  { throttle: 100 }
);
```

#### Get Current Scroll Position

```typescript
// Batched read - safe to call frequently
const position = scrollManager.getScrollPosition();
console.log('Current Y:', position.y);
console.log('Direction:', position.direction);
```

#### Batch DOM Measurements

```typescript
const elements = document.querySelectorAll('.animated-element');

// Batch all DOM reads together
const measurements = scrollManager.measureBatch([
  () => elements[0]?.getBoundingClientRect(),
  () => elements[1]?.getBoundingClientRect(),
  () => elements[2]?.getBoundingClientRect(),
]);

// Then do all DOM writes
measurements.forEach((rect, index) => {
  if (rect && elements[index]) {
    elements[index].style.transform = `translateY(${rect.height}px)`;
  }
});
```

#### React Component Integration

```typescript
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
```

#### Scroll-Based Animation

```typescript
const element = document.querySelector('.animated-header');

const unsubscribe = scrollManager.onScroll((position) => {
  if (!element) return;

  // Use GPU-accelerated properties only
  const opacity = Math.max(0, 1 - position.y / 300);
  element.style.opacity = opacity.toString();
  element.style.transform = `translateY(${position.y * 0.5}px)`;
});
```

#### Multiple Listeners with Different Rates

```typescript
// Fast updates for critical UI (16ms = 60fps)
const unsubscribe1 = scrollManager.onScroll(
  (position) => updateParallax(position.y),
  { throttle: 16 }
);

// Slower updates for less critical features (100ms)
const unsubscribe2 = scrollManager.onScroll(
  (position) => updateScrollProgress(position.y),
  { throttle: 100 }
);

// Clean up both
return () => {
  unsubscribe1();
  unsubscribe2();
};
```

### API

#### `onScroll(callback, options?)`

Register a scroll listener with throttling.

**Parameters:**
- `callback: (position: ScrollPosition) => void` - Function called on scroll events
- `options?: ScrollOptions` - Configuration options
  - `throttle?: number` - Throttle interval in ms (default: 16)
  - `passive?: boolean` - Use passive listener (default: true)

**Returns:** `() => void` - Unsubscribe function

#### `getScrollPosition()`

Get current scroll position (batched read).

**Returns:** `ScrollPosition` - Current scroll position with direction

```typescript
interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
}
```

#### `measureBatch(measurements)`

Batch multiple DOM measurements to avoid layout thrashing.

**Parameters:**
- `measurements: MeasurementFn[]` - Array of measurement functions

**Returns:** `any[]` - Array of measurement results

### Performance Benefits

- **Passive Listeners**: Scroll events don't block scrolling performance
- **Throttling**: Limits callback execution to 60fps maximum (16ms)
- **RAF Batching**: Uses requestAnimationFrame to batch scroll updates
- **Layout Thrashing Prevention**: Separates DOM reads from writes
- **Automatic Cleanup**: Prevents memory leaks with proper cleanup

### Best Practices

1. **Always clean up listeners** when components unmount
2. **Use appropriate throttle rates**: 16ms for animations, 100ms+ for less critical updates
3. **Batch DOM measurements** using `measureBatch()` to avoid layout thrashing
4. **Use GPU-accelerated properties** (transform, opacity) in scroll callbacks
5. **Avoid heavy calculations** in scroll callbacks - keep them lightweight

## AnimationController

A high-performance scroll-based animation system with GPU acceleration and automatic viewport-based pausing.

### Features

- **requestAnimationFrame-based**: Smooth 60fps animations (Requirements 3.1, 3.4)
- **GPU-Accelerated**: Only uses CSS transforms and opacity (Requirement 3.2)
- **Viewport-Based Pausing**: Automatically pauses animations outside viewport (Requirement 3.3)
- **Lifecycle Management**: Full control with pause, resume, and destroy methods
- **ScrollManager Integration**: Efficient scroll handling with throttling
- **Web Animations API**: Native browser animation support
- **Batched DOM Operations**: Prevents layout thrashing (Requirement 3.5)

### Usage

#### Basic Fade-In Animation

```typescript
import { animationController } from '@/lib/performance/AnimationController';

const element = document.querySelector('.fade-in');
const handle = animationController.registerScrollAnimation(element, {
  keyframes: [
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 1 }
  ],
  scrollRange: [0, 1], // Animate from 0% to 100% of scroll range
  easing: 'ease-out',
  viewportThreshold: 0.1 // Pause when less than 10% visible
});

// Clean up when done
handle.destroy();
```

#### Slide-Up Animation

```typescript
const handle = animationController.registerScrollAnimation(element, {
  keyframes: [
    { transform: 'translateY(100px)', opacity: 0, offset: 0 },
    { transform: 'translateY(0)', opacity: 1, offset: 1 }
  ],
  scrollRange: [0, 0.8], // Complete animation at 80% of scroll range
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  viewportThreshold: 0.2
});
```

#### React Component Integration

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

#### Manual Control

```typescript
const handle = animationController.registerScrollAnimation(element, config);

// Pause animation
handle.pause();

// Resume animation
handle.resume();

// Destroy animation
handle.destroy();
```

#### Multiple Animations

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

### API

#### `registerScrollAnimation(element, config)`

Registers a scroll-based animation for an element.

**Parameters:**
- `element: HTMLElement` - The element to animate
- `config: ScrollAnimationConfig` - Animation configuration
  - `keyframes: Keyframe[]` - Animation keyframes (only transform and opacity allowed)
  - `scrollRange: [number, number]` - Scroll range as [start, end] from 0 to 1
  - `easing?: string` - Easing function (default: 'linear')
  - `viewportThreshold?: number` - Viewport visibility threshold 0-1 (default: 0.1)

**Returns:** `AnimationHandle` - Handle for controlling the animation

#### `pauseAnimation(handle)`

Manually pauses an animation.

#### `resumeAnimation(handle)`

Resumes a paused animation.

#### `destroyAnimation(handle)`

Destroys an animation and cleans up resources.

### Validation

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

### Performance Benefits

- **GPU Acceleration**: Animations run on GPU compositor thread
- **Viewport Pausing**: Saves resources for off-screen elements
- **Batched DOM Operations**: Prevents layout thrashing
- **60fps Updates**: Maintains smooth frame rate during scroll
- **Efficient Detection**: Uses Intersection Observer for viewport detection

### Best Practices

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

### Documentation

For more details, see:
- [AnimationController Implementation Guide](./ANIMATIONCONTROLLER_IMPLEMENTATION.md)
- [AnimationController Examples](./AnimationController.example.ts)

## Requirements Validated

### Lazy Loading System
- ✅ 1.1: Load only above-the-fold components in critical path
- ✅ 1.2: Load components within 100ms of viewport entry
- ✅ 1.3: Implement code splitting for below-the-fold components
- ✅ 1.5: Display loading placeholder during component load
- ✅ 5.1: Implement code splitting at route boundaries

### Image Optimization System
- ✅ 2.1: Serve images in modern formats (WebP with fallback)
- ✅ 2.2: Defer loading images outside viewport
- ✅ 2.4: Display blur placeholder during loading
- ✅ 2.5: Implement responsive image sizing
- ✅ 2.6: Preload critical path images only

### Animation Performance System
- ✅ 3.1: Throttle scroll calculations to maximum 60fps (16ms)
- ✅ 3.2: Use only CSS transforms and opacity (validated at registration)
- ✅ 3.3: Pause animations when elements are outside viewport
- ✅ 3.4: Use requestAnimationFrame for animation updates
- ✅ 3.5: Batch DOM reads and writes for multiple animations

### Scroll Performance System
- ✅ 8.1: Use passive event listeners for scroll events
- ✅ 8.2: Debounce scroll event handlers to execute maximum once per 16ms
- ✅ 8.4: Avoid layout thrashing by batching DOM measurements
