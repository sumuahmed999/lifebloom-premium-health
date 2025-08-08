import { useState } from "react";
import { Plus, FileText, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createBlogPost, createVideoPost } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ContentCreateHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentType, setContentType] = useState<"blog" | "video">("blog");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    image_url: "",
    category: "",
    published: false,
    read_time: 5,
  });

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    category: "",
    published: false,
    duration: 0,
  });

  const categories = ["Health", "Wellness", "Pharmacy", "Medicine", "Tips", "News"];

  const handleCreateBlog = async () => {
    if (!blogForm.title || !blogForm.content || !blogForm.author) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createBlogPost(blogForm);
      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully",
      });
      setBlogForm({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        image_url: "",
        category: "",
        published: false,
        read_time: 5,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createVideoPost(videoForm);
      toast({
        title: "Video post created",
        description: "Your video post has been created successfully",
      });
      setVideoForm({
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        category: "",
        published: false,
        duration: 0,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create video post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Create Button */}
      <div className="fixed top-24 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="btn-premium rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300"
          size="lg"
        >
          <Plus className="w-6 h-6" />
          <span className="hidden md:inline ml-2">Create Content</span>
        </Button>
      </div>

      {/* Create Content Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-display gradient-text">
              <Plus className="w-6 h-6" />
              Create Health Content
            </DialogTitle>
          </DialogHeader>

          {/* Content Type Selector */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={contentType === "blog" ? "default" : "outline"}
              onClick={() => setContentType("blog")}
              className="flex-1 h-12"
            >
              <FileText className="w-5 h-5 mr-2" />
              Blog Post
            </Button>
            <Button
              variant={contentType === "video" ? "default" : "outline"}
              onClick={() => setContentType("video")}
              className="flex-1 h-12"
            >
              <Video className="w-5 h-5 mr-2" />
              Video Post
            </Button>
          </div>

          {/* Blog Form */}
          {contentType === "blog" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="blog-title">Title *</Label>
                <Input
                  id="blog-title"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="Enter blog post title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="blog-excerpt">Excerpt</Label>
                <Textarea
                  id="blog-excerpt"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Brief description of the blog post"
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="blog-content">Content *</Label>
                <Textarea
                  id="blog-content"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blog-author">Author *</Label>
                  <Input
                    id="blog-author"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="Author name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="blog-read-time">Read Time (minutes)</Label>
                  <Input
                    id="blog-read-time"
                    type="number"
                    value={blogForm.read_time}
                    onChange={(e) => setBlogForm({ ...blogForm, read_time: parseInt(e.target.value) || 5 })}
                    placeholder="5"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blog-image">Image URL</Label>
                <Input
                  id="blog-image"
                  value={blogForm.image_url}
                  onChange={(e) => setBlogForm({ ...blogForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="blog-category">Category</Label>
                <Select value={blogForm.category} onValueChange={(value) => setBlogForm({ ...blogForm, category: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="blog-published"
                  checked={blogForm.published}
                  onCheckedChange={(checked) => setBlogForm({ ...blogForm, published: checked })}
                />
                <Label htmlFor="blog-published">Publish immediately</Label>
              </div>

              <Button
                onClick={handleCreateBlog}
                disabled={loading}
                className="w-full btn-premium"
                size="lg"
              >
                {loading ? "Creating..." : "Create Blog Post"}
              </Button>
            </div>
          )}

          {/* Video Form */}
          {contentType === "video" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title *</Label>
                <Input
                  id="video-title"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="Enter video title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Video description"
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="video-url">Video URL *</Label>
                <Input
                  id="video-url"
                  value={videoForm.video_url}
                  onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
                <Input
                  id="video-thumbnail"
                  value={videoForm.thumbnail_url}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-duration">Duration (seconds)</Label>
                  <Input
                    id="video-duration"
                    type="number"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) || 0 })}
                    placeholder="120"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="video-category">Category</Label>
                  <Select value={videoForm.category} onValueChange={(value) => setVideoForm({ ...videoForm, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <Button
                onClick={handleCreateVideo}
                disabled={loading}
                className="w-full btn-premium"
                size="lg"
              >
                {loading ? "Creating..." : "Create Video Post"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCreateHeader;