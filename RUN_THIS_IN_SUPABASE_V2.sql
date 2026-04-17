-- ============================================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR AND RUN IT
-- ============================================================================
-- This creates the "Get in Touch" content table with ALL fields including
-- card titles and descriptions
-- ============================================================================

-- Create get_in_touch_content table
CREATE TABLE IF NOT EXISTS get_in_touch_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Section Header
  badge_text TEXT NOT NULL DEFAULT 'Get In Touch',
  heading TEXT NOT NULL DEFAULT 'Contact LifeBloom',
  description TEXT NOT NULL DEFAULT 'Ready to experience premium healthcare? Get in touch with our team for consultations, appointments, or any questions about our services.',
  
  -- Intro Section
  intro_heading TEXT NOT NULL DEFAULT 'Get in Touch',
  intro_description TEXT NOT NULL DEFAULT 'We''re here to help you with all your healthcare needs. Reach out to us through any of the following channels, and our dedicated team will assist you promptly.',
  
  -- Call Card
  call_card_title TEXT NOT NULL DEFAULT 'Call Us',
  call_card_description TEXT NOT NULL DEFAULT 'Available during business hours. Call us for immediate assistance or to book an appointment.',
  
  -- Email Card
  email_card_title TEXT NOT NULL DEFAULT 'Email Us',
  email_card_description TEXT NOT NULL DEFAULT 'Send us an email and we''ll respond within 24 hours. Perfect for non-urgent inquiries.',
  
  -- Visit Card
  visit_card_title TEXT NOT NULL DEFAULT 'Visit Us',
  visit_card_description TEXT NOT NULL DEFAULT 'Visit our pharmacy and healthcare center. We''re located in the heart of Balipara, easily accessible from all parts of Tezpur.',
  
  -- Hours Card
  hours_card_title TEXT NOT NULL DEFAULT 'Opening Hours',
  hours_card_description TEXT NOT NULL DEFAULT 'Emergency services available 24/7.',
  
  -- Metadata
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Ensure only one row exists (singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS idx_get_in_touch_content_singleton 
  ON get_in_touch_content((id IS NOT NULL));

-- Enable Row Level Security
ALTER TABLE get_in_touch_content ENABLE ROW LEVEL SECURITY;

-- Public can view
CREATE POLICY "Public can view get in touch content"
  ON get_in_touch_content FOR SELECT
  USING (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update get in touch content"
  ON get_in_touch_content FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert get in touch content"
  ON get_in_touch_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_get_in_touch_content_updated_at
  BEFORE UPDATE ON get_in_touch_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default content with ALL fields
INSERT INTO get_in_touch_content (
  badge_text,
  heading,
  description,
  intro_heading,
  intro_description,
  call_card_title,
  call_card_description,
  email_card_title,
  email_card_description,
  visit_card_title,
  visit_card_description,
  hours_card_title,
  hours_card_description
) VALUES (
  'Get In Touch',
  'Contact LifeBloom',
  'Ready to experience premium healthcare? Get in touch with our team for consultations, appointments, or any questions about our services.',
  'Get in Touch',
  'We''re here to help you with all your healthcare needs. Reach out to us through any of the following channels, and our dedicated team will assist you promptly.',
  'Call Us',
  'Available during business hours. Call us for immediate assistance or to book an appointment.',
  'Email Us',
  'Send us an email and we''ll respond within 24 hours. Perfect for non-urgent inquiries.',
  'Visit Us',
  'Visit our pharmacy and healthcare center. We''re located in the heart of Balipara, easily accessible from all parts of Tezpur.',
  'Opening Hours',
  'Emergency services available 24/7.'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DONE! Now you can edit ALL content from /admin/get-in-touch
-- ============================================================================
-- This includes:
-- ✅ Section headers (badge, heading, description)
-- ✅ Intro section (heading, description)
-- ✅ Call Us card (title, description)
-- ✅ Email Us card (title, description)
-- ✅ Visit Us card (title, description)
-- ✅ Opening Hours card (title, description)
-- ============================================================================

