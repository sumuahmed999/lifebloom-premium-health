import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { performanceMonitor } from './lib/performance/PerformanceMonitor'

// Initialize performance monitoring
performanceMonitor.start();

// Log metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    performanceMonitor.logMetrics();
  }, 2000); // Wait 2s for metrics to stabilize
});

createRoot(document.getElementById("root")!).render(<App />);
