-- ============================================================================
-- COMPLETE SETUP FOR CONTACT_CARDS TABLE
-- Run this entire script in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create contact_cards table
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

-- Step 3: Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_contact_cards_sort_order ON contact_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_cards_status ON contact_cards(status);
CREATE INDEX IF NOT EXISTS idx_contact_cards_status_sort ON contact_cards(status, sort_order);

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE contact_cards ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view published cards" ON contact_cards;
DROP POLICY IF EXISTS "Authenticated users can view all cards" ON contact_cards;
DROP POLICY IF EXISTS "Authenticated users can insert cards" ON contact_cards;
DROP POLICY IF EXISTS "Authenticated users can update cards" ON contact_cards;
DROP POLICY IF EXISTS "Authenticated users can delete cards" ON contact_cards;

-- Step 6: Create RLS Policies

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

-- Step 7: Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS update_contact_cards_updated_at ON contact_cards;
CREATE TRIGGER update_contact_cards_updated_at
  BEFORE UPDATE ON contact_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert seed data (4 default contact cards)
INSERT INTO contact_cards (icon, title, short_description, detailed_content, cta_button_text, cta_link, color_theme, status, sort_order)
VALUES
  (
    'Phone',
    'Call Us',
    'Speak directly with our friendly staff',
    '<h3>Get in Touch by Phone</h3><p>Our team is available to answer your questions and provide assistance. Call us during business hours for immediate support.</p><ul><li>Quick response times</li><li>Knowledgeable staff</li><li>Friendly service</li></ul>',
    'Call Now',
    'tel:+1234567890',
    'primary-blue',
    true,
    0
  ),
  (
    'Mail',
    'Email Us',
    'Send us a message anytime',
    '<h3>Contact Us by Email</h3><p>Prefer to write? Send us an email and we''ll get back to you as soon as possible. We typically respond within 24 hours.</p><p>Email us at: <strong>info@example.com</strong></p>',
    'Send Email',
    'mailto:info@example.com',
    'secondary-green',
    true,
    1
  ),
  (
    'MapPin',
    'Visit Us',
    'Come see us in person',
    '<h3>Visit Our Location</h3><p>We''re conveniently located and easy to find. Stop by during our business hours to speak with us in person.</p><p><strong>Address:</strong><br>123 Main Street<br>City, State 12345</p>',
    'Get Directions',
    'https://maps.google.com',
    'accent-teal',
    true,
    2
  ),
  (
    'Clock',
    'Opening Hours',
    'Check when we''re available',
    '<h3>Our Business Hours</h3><p>We''re here to serve you during the following hours:</p><ul><li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</li><li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li><li><strong>Sunday:</strong> Closed</li></ul><p>Holiday hours may vary.</p>',
    'View Schedule',
    'https://example.com/hours',
    'neutral-gray',
    true,
    3
  )
ON CONFLICT (sort_order) DO NOTHING;

-- Step 9: Verify the setup
SELECT 
  'Setup Complete!' as status,
  COUNT(*) as total_cards,
  SUM(CASE WHEN status = true THEN 1 ELSE 0 END) as published_cards
FROM contact_cards;
