import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url?: string;
  category: string;
  published: boolean;
  created_at: string;
  read_time: number;
}

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-64 bg-slate-200 rounded-xl"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <p className="text-slate-600 mb-8">This article may have been removed or is no longer available.</p>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button
            variant="ghost"
            className="mb-6 text-slate-600 hover:text-primary -ml-2"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            {post.category}
          </Badge>

          <h1
            className="text-3xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: "hsl(207 61% 35%)" }}
          >
            {post.title}
          </h1>

          <p className="text-lg text-slate-600 mb-8">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.read_time} min read
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image_url && (
        <div className="container mx-auto px-4 max-w-3xl mb-10">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-96 shadow-md"
          />
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 max-w-3xl pb-20">
        <div
          className="prose prose-lg max-w-none text-slate-700 leading-relaxed
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-primary prose-blockquote:text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
