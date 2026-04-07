import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { PageLoadingFallback } from "./components/LoadingFallback";
import { AuthGuard } from "./components/AuthGuard";
import { AdminLayout } from "./components/AdminLayout";

// Lazy load route components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));

// Lazy load admin pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Services = lazy(() => import("./pages/admin/Services"));
const Enquiries = lazy(() => import("./pages/admin/Enquiries"));
const Testimonials = lazy(() => import("./pages/admin/Testimonials"));
const Blogs = lazy(() => import("./pages/admin/Blogs"));
const Videos = lazy(() => import("./pages/admin/Videos"));
const Contact = lazy(() => import("./pages/admin/Contact"));

const queryClient = new QueryClient();

const App = () => {
  useSmoothScroll();
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="overflow-x-hidden">
        <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AuthGuard>
                    <AdminLayout />
                  </AuthGuard>
                }
              >
                {/* Redirect /admin to /admin/dashboard */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="services" element={<Services />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="videos" element={<Videos />} />
                <Route path="contact" element={<Contact />} />
                <Route path="enquiries" element={<Enquiries />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTopButton />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
