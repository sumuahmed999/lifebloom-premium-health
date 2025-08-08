import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  image_url?: string
  category: string
  published: boolean
  created_at: string
  updated_at: string
  read_time: number
}

export interface VideoPost {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
  category: string
  published: boolean
  created_at: string
  updated_at: string
  duration: number
}

// Blog functions
export const getBlogPosts = async (limit = 6) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const getVideoPosts = async (limit = 4) => {
  const { data, error } = await supabase
    .from('video_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()

  if (error) throw error
  return data
}

export const createVideoPost = async (post: Omit<VideoPost, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('video_posts')
    .insert([post])
    .select()

  if (error) throw error
  return data
}

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}