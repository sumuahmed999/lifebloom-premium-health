import { useEffect, useState } from "react";
import { Calendar, Clock, User, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts, getVideoPosts, BlogPost, VideoPost } from "@/lib/supabase";

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videoPosts, setVideoPosts] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [blogs, videos] = await Promise.all([
          getBlogPosts(3),
          getVideoPosts(3)
        ]);
        setBlogPosts(blogs);
        setVideoPosts(videos);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-64 h-8 bg-muted animate-pulse rounded mx-auto mb-4"></div>
            <div className="w-96 h-6 bg-muted animate-pulse rounded mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-full h-48 bg-muted animate-pulse rounded-xl"></div>
                <div className="w-3/4 h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Health</span> Insights & Tips
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest health insights, expert advice, and wellness tips 
            from our healthcare professionals.
          </p>
        </div>

        {/* Blog Posts */}
        {blogPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-primary">Latest Articles</h3>
              <Button variant="outline" className="group">
                View All Articles
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={post.id} className={`floating-card group cursor-pointer animate-on-scroll stagger-${index + 1}`}>
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="text-4xl">📝</div>
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-white/90 text-primary">
                        {post.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.read_time} min read
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Video Posts */}
        {videoPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-primary">Health Videos</h3>
              <Button variant="outline" className="group">
                View All Videos
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoPosts.map((video, index) => (
                <Card key={video.id} className={`floating-card group cursor-pointer animate-on-scroll stagger-${index + 4}`}>
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white bg-primary/80 rounded-full p-3" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Play className="w-16 h-16 text-white bg-primary/90 rounded-full p-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white/90 text-secondary">
                        {video.category}
                      </Badge>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(video.created_at)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Video
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {blogPosts.length === 0 && videoPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
            <p className="text-muted-foreground">
              Health articles and videos will be available here soon. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;