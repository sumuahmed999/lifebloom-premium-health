/**
 * OptimizedImage Usage Examples
 * 
 * This file demonstrates various use cases for the OptimizedImage component.
 */

import { OptimizedImage } from './OptimizedImage';

/**
 * Example 1: Basic usage with lazy loading (default)
 */
export const BasicExample = () => (
  <OptimizedImage
    src="/images/product.jpg"
    alt="Product image"
    className="w-full h-64 rounded-lg"
  />
);

/**
 * Example 2: Hero image with priority loading (above-fold)
 * Priority images are preloaded and loaded eagerly for better LCP
 */
export const HeroImageExample = () => (
  <OptimizedImage
    src="/images/hero.jpg"
    alt="Hero banner"
    priority={true}
    lazy={false}
    className="w-full h-screen object-cover"
  />
);

/**
 * Example 3: Image with blur placeholder
 * Provides better perceived performance during loading
 */
export const BlurPlaceholderExample = () => (
  <OptimizedImage
    src="/images/gallery-1.jpg"
    alt="Gallery image"
    placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
    className="w-full h-96"
  />
);

/**
 * Example 4: Responsive image with custom sizes
 * Optimizes bandwidth by loading appropriate size for viewport
 */
export const ResponsiveExample = () => (
  <OptimizedImage
    src="/images/banner.jpg"
    alt="Responsive banner"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    width={1200}
    height={600}
    className="w-full"
  />
);

/**
 * Example 5: Gallery with lazy loading
 * Images load as user scrolls, reducing initial page load
 */
export const GalleryExample = () => (
  <div className="grid grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <OptimizedImage
        key={i}
        src={`/images/gallery-${i}.jpg`}
        alt={`Gallery image ${i}`}
        lazy={true}
        className="w-full h-64 object-cover rounded"
      />
    ))}
  </div>
);

/**
 * Example 6: Product card with optimized thumbnail
 */
export const ProductCardExample = () => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg">
    <OptimizedImage
      src="/images/product-thumbnail.jpg"
      alt="Product thumbnail"
      width={400}
      height={300}
      className="w-full"
    />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">Product Name</div>
      <p className="text-gray-700 text-base">
        Product description goes here.
      </p>
    </div>
  </div>
);

/**
 * Example 7: Background image replacement
 * Use OptimizedImage instead of CSS background-image for better optimization
 */
export const BackgroundImageExample = () => (
  <div className="relative h-screen">
    <OptimizedImage
      src="/images/background.jpg"
      alt="Background"
      priority={true}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="relative z-10 flex items-center justify-center h-full">
      <h1 className="text-white text-4xl font-bold">Content over image</h1>
    </div>
  </div>
);
