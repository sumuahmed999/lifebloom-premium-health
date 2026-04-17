-- Migration: Add editable content fields to contact_info table
-- Description: Adds fields for section heading, subtitle, title, and description

-- Add new columns to contact_info table
ALTER TABLE contact_info
ADD COLUMN IF NOT EXISTS section_heading TEXT DEFAULT 'Contact LifeBloom',
ADD COLUMN IF NOT EXISTS section_subtitle TEXT DEFAULT 'Ready to experience premium healthcare? Get in touch with our team for consultations, appointments, or any questions about our services.',
ADD COLUMN IF NOT EXISTS content_title TEXT DEFAULT 'Get in Touch',
ADD COLUMN IF NOT EXISTS content_description TEXT DEFAULT 'We''re here to help you with all your healthcare needs. Reach out to us through any of the following channels, and our dedicated team will assist you promptly.';

-- Update existing row if it exists
UPDATE contact_info
SET 
  section_heading = COALESCE(section_heading, 'Contact LifeBloom'),
  section_subtitle = COALESCE(section_subtitle, 'Ready to experience premium healthcare? Get in touch with our team for consultations, appointments, or any questions about our services.'),
  content_title = COALESCE(content_title, 'Get in Touch'),
  content_description = COALESCE(content_description, 'We''re here to help you with all your healthcare needs. Reach out to us through any of the following channels, and our dedicated team will assist you promptly.')
WHERE id IS NOT NULL;
