import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  getBlogPosts, 
  getVideoPosts, 
  createBlogPost, 
  createVideoPost, 
  updateBlogPost, 
  deleteBlogPost, 
  BlogPost, 
  VideoPost 
} from "@/lib/supabase";

const AdminPanel = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videoPosts, setVideoPosts] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'videos'>('blogs');
  const [editingPost, setEditingPost] = useState<BlogPost | VideoPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    image_url: '',
    category: '',
    published: false,
    read_time: 5
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    category: '',
    published: false,
    duration: 0
  });

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [blogs, videos] = await Promise.all([
        getBlogPosts(50), // Get more for admin
        getVideoPosts(50)
      ]);
      setBlogPosts(blogs);
      setVideoPosts(videos);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    try {
      await createBlogPost(blogForm);
      toast({
        title: "Success",
        description: "Blog post created successfully"
      });
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        image_url: '',
        category: '',
        published: false,
        read_time: 5
      });
      setIsDialogOpen(false);
      fetchAllContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      });
    }
  };

  const handleCreateVideo = async () => {
    try {
      await createVideoPost(videoForm);
      toast({
        title: "Success",
        description: "Video post created successfully"
      });
      setVideoForm({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        category: '',
        published: false,
        duration: 0
      });
      setIsDialogOpen(false);
      fetchAllContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create video post",
        variant: "destructive"
      });
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await updateBlogPost(id, { published });
      toast({
        title: "Success",
        description: `Post ${published ? 'published' : 'unpublished'} successfully`
      });
      fetchAllContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deleteBlogPost(id);
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
      fetchAllContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const categories = [
    'General Health',
    'Nutrition',
    'Exercise',
    'Mental Health',
    'Pharmacy Tips',
    'Disease Prevention',
    'Wellness'
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage your health blog posts and videos</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button 
            variant={activeTab === 'blogs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('blogs')}
          >
            Blog Posts ({blogPosts.length})
          </Button>
          <Button 
            variant={activeTab === 'videos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('videos')}
          >
            Videos ({videoPosts.length})
          </Button>
        </div>

        {/* Create Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Create {activeTab === 'blogs' ? 'Blog Post' : 'Video'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Create New {activeTab === 'blogs' ? 'Blog Post' : 'Video'}
              </DialogTitle>
            </DialogHeader>
            
            {activeTab === 'blogs' ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Enter blog title"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Full blog content"
                    rows={8}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="read_time">Read Time (minutes)</Label>
                    <Input
                      id="read_time"
                      type="number"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={blogForm.image_url}
                    onChange={(e) => setBlogForm({ ...blogForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={blogForm.category} onValueChange={(value) => setBlogForm({ ...blogForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={blogForm.published}
                    onCheckedChange={(checked) => setBlogForm({ ...blogForm, published: checked })}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
                <Button onClick={handleCreateBlog} className="w-full">
                  Create Blog Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="Enter video title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    placeholder="Video description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={videoForm.video_url}
                    onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video-category">Category</Label>
                    <Select value={videoForm.category} onValueChange={(value) => setVideoForm({ ...videoForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="video-published"
                    checked={videoForm.published}
                    onCheckedChange={(checked) => setVideoForm({ ...videoForm, published: checked })}
                  />
                  <Label htmlFor="video-published">Publish immediately</Label>
                </div>
                <Button onClick={handleCreateVideo} className="w-full">
                  Create Video Post
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Content Grid */}
        <div className="grid gap-6">
          {activeTab === 'blogs' ? (
            blogPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublished(post.id, !post.published)}
                      >
                        {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {post.author} • {post.category}</span>
                    <span>{post.published ? 'Published' : 'Draft'}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            videoPosts.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        {video.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{video.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{video.category} • {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                    <span>{video.published ? 'Published' : 'Draft'}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;