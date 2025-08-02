import { useEffect } from 'react';

const SCROLL_SPEED = 0.1; // Lower = smoother, higher = faster
const SCROLL_THRESHOLD = 0.5;

export const useSmoothScroll = () => {
  useEffect(() => {
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.08; // Buttery smooth easing
    let isScrolling = false;
    let requestId: number;

    const smoothScrollTo = (targetY: number) => {
      targetScroll = targetY;
      if (!isScrolling) {
        isScrolling = true;
        animate();
      }
    };

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * ease;
      
      if (Math.abs(targetScroll - currentScroll) > SCROLL_THRESHOLD) {
        window.scrollTo(0, currentScroll);
        requestId = requestAnimationFrame(animate);
      } else {
        window.scrollTo(0, targetScroll);
        isScrolling = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Calculate new target position
      const delta = e.deltaY * SCROLL_SPEED;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta));
      
      if (!isScrolling) {
        currentScroll = window.pageYOffset;
        isScrolling = true;
        animate();
      }
    };

    const handleResize = () => {
      currentScroll = window.pageYOffset;
      targetScroll = currentScroll;
    };

    // Initialize current scroll position
    currentScroll = window.pageYOffset;
    targetScroll = currentScroll;

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // Handle anchor clicks for smooth navigation
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            smoothScrollTo(elementTop - 80); // Account for navbar
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleAnchorClick);
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, []);
};