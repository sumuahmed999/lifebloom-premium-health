import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rejudwrynbxoyzlrqqst.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlanVkd3J5bmJ4b3l6bHJxcXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzY4NjUsImV4cCI6MjA3MDIxMjg2NX0.AMBlkzBMSlO8ohrDmNSPAl6zMKFIORBBo-iDDJQC8kI";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url?: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  read_time: number;
}

export interface VideoPost {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  duration: number;
}

// Blog functions
export const getBlogPosts = async (limit = 6) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getVideoPosts = async (limit = 4) => {
  const { data, error } = await supabase
    .from("video_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([post])
    .select();

  if (error) throw error;
  return data;
};

export const createVideoPost = async (
  post: Omit<VideoPost, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("video_posts")
    .insert([post])
    .select();

  if (error) throw error;
  return data;
};

export const updateBlogPost = async (
  id: string,
  updates: Partial<BlogPost>
) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
};
