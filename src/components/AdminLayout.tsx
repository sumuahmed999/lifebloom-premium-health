/**
 * AdminLayout Component
 * 
 * Main layout wrapper for the admin panel providing navigation,
 * user info display, and logout functionality.
 * 
 * Features:
 * - Navigation sidebar with links to all content sections
 * - User information display
 * - Logout functionality
 * - Responsive layout for mobile/tablet/desktop
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  FileText,
  Video,
  Phone,
  Mail,
  LogOut,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Navigation item configuration
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Briefcase,
  },
  {
    title: 'Testimonials',
    href: '/admin/testimonials',
    icon: MessageSquare,
  },
  {
    title: 'Blog Posts',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    title: 'Contact Cards',
    href: '/admin/contact-cards',
    icon: CreditCard,
  },
  {
    title: 'Enquiries',
    href: '/admin/enquiries',
    icon: Mail,
  },
  {
    title: 'Contact Info',
    href: '/admin/contact',
    icon: Phone,
  },
];

/**
 * AdminLayout component
 */
export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  /**
   * Check if nav item is active
   */
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  /**
   * Sidebar content (desktop only)
   */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">LifeBloom Admin</h2>
        <p className="text-sm text-muted-foreground mt-1">Content Management</p>
      </div>
      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Info & Logout */}
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Signed in as</p>
          <p className="text-sm text-muted-foreground truncate">
            {user?.email || 'Unknown'}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header — only shows hamburger, no X */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <h2 className="text-lg font-bold text-primary">LifeBloom Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay (backdrop) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white border-r shadow-xl transition-transform duration-300 ease-in-out flex flex-col',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header with single close button */}
        <div className="flex items-center justify-between px-5 h-14 border-b shrink-0">
          <h2 className="text-lg font-bold text-primary">LifeBloom Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav links */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User info & logout — always visible at bottom */}
        <div className="border-t p-4 space-y-3 shrink-0">
          <div>
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email || 'Unknown'}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 z-30 h-full w-64 bg-background border-r">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen bg-slate-50">
        <div className="pt-14 lg:pt-0 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
