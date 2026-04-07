/**
 * Admin Dashboard Page
 * 
 * Main dashboard view for the admin panel showing content statistics
 * and quick navigation to content management sections.
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ContentService } from '@/lib/services/ContentService';
import {
  FileText,
  MessageSquare,
  Briefcase,
  Video,
  Phone,
  Plus,
  TrendingUp,
  Clock,
} from 'lucide-react';

/**
 * Dashboard statistics type
 */
interface DashboardStats {
  services: { total: number; published: number; draft: number };
  testimonials: { total: number; published: number; draft: number };
  blogs: { total: number; published: number; draft: number };
  videos: { total: number; published: number; draft: number };
}

/**
 * Admin Dashboard component
 */
export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch statistics
        const statsResponse = await ContentService.getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        // Fetch recent content
        const recentResponse = await ContentService.getRecentContent(5);
        if (recentResponse.success && recentResponse.data) {
          setRecentItems(recentResponse.data.created);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const contentSections = [
    {
      title: 'Services',
      description: 'Manage healthcare service offerings',
      icon: Briefcase,
      path: '/admin/services',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: stats?.services,
    },
    {
      title: 'Testimonials',
      description: 'Manage customer testimonials',
      icon: MessageSquare,
      path: '/admin/testimonials',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: stats?.testimonials,
    },
    {
      title: 'Blog Posts',
      description: 'Manage blog articles',
      icon: FileText,
      path: '/admin/blogs',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: stats?.blogs,
    },
    {
      title: 'Videos',
      description: 'Manage video content',
      icon: Video,
      path: '/admin/videos',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      stats: stats?.videos,
    },
    {
      title: 'Contact Info',
      description: 'Update contact information',
      icon: Phone,
      path: '/admin/contact',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: undefined,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentTitle = (item: any) => {
    return item.title || item.customer_name || 'Untitled';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Manage your website content from here.
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.services.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.services.published} published, {stats.services.draft} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.testimonials.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.testimonials.published} published, {stats.testimonials.draft} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blogs.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.blogs.published} published, {stats.blogs.draft} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videos.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.videos.published} published, {stats.videos.draft} draft
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Management Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contentSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.path} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-2`}>
                  <Icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
                {section.stats && (
                  <div className="pt-2 text-sm text-muted-foreground">
                    {section.stats.total} total items
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(section.path)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Manage {section.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      {recentItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Recent Content</CardTitle>
            </div>
            <CardDescription>
              Recently created content across all types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {item.type === 'services' && <Briefcase className="h-4 w-4 text-blue-600" />}
                      {item.type === 'testimonials' && <MessageSquare className="h-4 w-4 text-green-600" />}
                      {item.type === 'blogs' && <FileText className="h-4 w-4 text-purple-600" />}
                      {item.type === 'videos' && <Video className="h-4 w-4 text-red-600" />}
                      <span className="text-sm font-medium capitalize">{item.type}</span>
                    </div>
                    <span className="text-sm">{getContentTitle(item.item)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.item.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading dashboard data...</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
