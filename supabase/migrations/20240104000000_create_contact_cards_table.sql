-- Migration: Create contact_cards table
-- Description: Stores contact cards for the "Get in Touch" section with rich content,
-- icons, color themes, and call-to-action buttons

-- Create contact_cards table
CREATE TABLE IF NOT EXISTS contact_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
  short_description TEXT CHECK (length(short_description) <= 200),
  detailed_content TEXT CHECK (length(detailed_content) <= 5000),
  cta_button_text TEXT,
  cta_link TEXT CHECK (cta_link ~ '^(tel:|mailto:|https:).+'),
  color_theme TEXT NOT NULL DEFAULT 'primary-blue',
  status BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_contact_cards_sort_order ON contact_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_cards_status ON contact_cards(status);
CREATE INDEX IF NOT EXISTS idx_contact_cards_status_sort ON contact_cards(status, sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view published cards
CREATE POLICY "Public can view published cards"
  ON contact_cards FOR SELECT
  USING (status = true);

-- RLS Policy: Authenticated users (admins) can view all cards
CREATE POLICY "Authenticated users can view all cards"
  ON contact_cards FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Authenticated users can insert cards
CREATE POLICY "Authenticated users can insert cards"
  ON contact_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policy: Authenticated users can update cards
CREATE POLICY "Authenticated users can update cards"
  ON contact_cards FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policy: Authenticated users can delete cards
CREATE POLICY "Authenticated users can delete cards"
  ON contact_cards FOR DELETE
  TO authenticated
  USING (true);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER update_contact_cards_updated_at
  BEFORE UPDATE ON contact_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
