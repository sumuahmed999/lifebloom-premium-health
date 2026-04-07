-- Migration: Create Supabase Storage buckets for admin content uploads
-- Description: Creates storage buckets for services, testimonials, blogs, and videos
-- with public read access and authenticated write access

-- Create storage buckets for each content type
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('services', 'services', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('testimonials', 'testimonials', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('blogs', 'blogs', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('videos', 'videos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for services bucket
CREATE POLICY "Public can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload service images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated users can update service images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can delete service images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'services');

-- Storage policies for testimonials bucket
CREATE POLICY "Public can view testimonial images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can upload testimonial images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can update testimonial images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can delete testimonial images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonials');

-- Storage policies for blogs bucket
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blogs');

-- Storage policies for videos bucket
CREATE POLICY "Public can view video thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload video thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update video thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete video thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');
