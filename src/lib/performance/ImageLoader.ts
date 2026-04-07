/**
 * ImageLoader Service
 * 
 * Provides utilities for image optimization including:
 * - Responsive image source generation
 * - WebP format support detection
 * - Critical image preloading
 * 
 * Requirements: 2.1, 2.5, 2.6
 */

export interface ResponsiveSource {
  srcSet: string;
  media?: string;
  type: string;
}

export class ImageLoader {
  private webpSupported: boolean | null = null;

  /**
   * Generate responsive image sources for different viewport widths
   * @param src - Base image URL
   * @param widths - Array of widths to generate sources for
   * @returns Array of responsive sources with srcset
   */
  getResponsiveSources(src: string, widths: number[]): ResponsiveSource[] {
    const sources: ResponsiveSource[] = [];
    const supportsWebP = this.supportsWebP();

    // Generate WebP sources if supported
    if (supportsWebP) {
      const webpSrcSet = widths
        .map(width => `${this.getImageUrl(src, width, 'webp')} ${width}w`)
        .join(', ');
      
      sources.push({
        srcSet: webpSrcSet,
        type: 'image/webp'
      });
    }

    // Generate fallback sources (JPEG/PNG)
    const fallbackFormat = this.getFallbackFormat(src);
    const fallbackSrcSet = widths
      .map(width => `${this.getImageUrl(src, width, fallbackFormat)} ${width}w`)
      .join(', ');
    
    sources.push({
      srcSet: fallbackSrcSet,
      type: `image/${fallbackFormat}`
    });

    return sources;
  }

  /**
   * Check if browser supports WebP format
   * @returns true if WebP is supported
   */
  supportsWebP(): boolean {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      this.webpSupported = false;
      return false;
    }

    // Create a test canvas to check WebP support
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // Check if toDataURL supports WebP
      this.webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } else {
      this.webpSupported = false;
    }

    return this.webpSupported;
  }

  /**
   * Preload a critical image for faster loading
   * @param src - Image URL to preload
   */
  preloadImage(src: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    // Check if already preloaded
    const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
    if (existingLink) {
      return;
    }

    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;

    // Add WebP type if supported
    if (this.supportsWebP() && src.includes('.webp')) {
      link.type = 'image/webp';
    }

    document.head.appendChild(link);
  }

  /**
   * Get image URL with specified width and format
   * In a real implementation, this would integrate with an image CDN
   * For now, it returns the original URL with query parameters
   */
  private getImageUrl(src: string, width: number, format: string): string {
    // If the src already has query parameters, append with &
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=${width}&format=${format}`;
  }

  /**
   * Determine fallback format based on original image extension
   */
  private getFallbackFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    
    if (extension === 'png') {
      return 'png';
    }
    
    // Default to JPEG for all other formats
    return 'jpeg';
  }
}

// Export singleton instance
export const imageLoader = new ImageLoader();
