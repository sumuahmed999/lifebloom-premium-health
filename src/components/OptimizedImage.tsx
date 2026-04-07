/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that provides:
 * - Responsive image sizing with srcset
 * - WebP format support with JPEG/PNG fallback
 * - Lazy loading with Intersection Observer
 * - Blur placeholder during loading
 * - Priority loading for above-fold images
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { useState, useEffect, useRef } from 'react';
import { imageLoader } from '../lib/performance/ImageLoader';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  lazy?: boolean;
  placeholder?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  lazy = true,
  placeholder,
  priority = false,
  className = '',
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Preload priority images
  useEffect(() => {
    if (priority) {
      imageLoader.preloadImage(src);
    }
  }, [src, priority]);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) {
      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '200px', // Start loading 200px before entering viewport
      threshold: 0.01,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect observer once image is in view
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      });
    }, options);

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority, isInView]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate responsive sources
  const responsiveWidths = [320, 640, 768, 1024, 1280, 1536];
  const sources = imageLoader.getResponsiveSources(src, responsiveWidths);

  // Container styles for aspect ratio and blur placeholder
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  };

  // Placeholder blur effect
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 0 : 1,
  };

  // Main image styles
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  // Error fallback styles
  const errorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    color: '#666',
    fontSize: '14px',
  };

  return (
    <div 
      className={className} 
      style={containerStyle}
      ref={imgRef}
    >
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
        />
      )}

      {/* Main image - only render when in view or priority */}
      {isInView && !error && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              sizes={sizes}
              media={source.media}
            />
          ))}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            style={imageStyle}
          />
        </picture>
      )}

      {/* Error fallback */}
      {error && (
        <div style={errorStyle}>
          <span>Image failed to load</span>
        </div>
      )}

      {/* Loading state when not yet in view */}
      {!isInView && !priority && (
        <div style={errorStyle}>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};
