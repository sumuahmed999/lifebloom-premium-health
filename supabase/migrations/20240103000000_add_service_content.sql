-- Migration: Add content field to services table
-- Description: Adds a rich text content field for detailed service descriptions

ALTER TABLE services ADD COLUMN IF NOT EXISTS content TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN services.content IS 'Rich text content for detailed service description on detail page';
