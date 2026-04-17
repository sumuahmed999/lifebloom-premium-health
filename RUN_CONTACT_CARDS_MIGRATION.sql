-- ============================================================================
-- CONTACT CARDS TABLE MIGRATION
-- ============================================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR AND RUN IT
-- This creates the contact_cards table for the Get in Touch Cards Management feature
-- ============================================================================

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

-- ============================================================================
-- OPTIONAL: Insert sample contact cards for testing
-- ============================================================================
-- Uncomment the lines below if you want to add sample data

/*
INSERT INTO contact_cards (icon, title, short_description, detailed_content, cta_button_text, cta_link, color_theme, status, sort_order) VALUES
('phone', 'Call Us', 'Available during business hours', '<p>Our team is available to assist you with appointments, consultations, and any healthcare questions you may have.</p><p><strong>Phone:</strong> +91 1234567890</p>', 'Call Now', 'tel:+911234567890', 'primary-blue', true, 0),
('mail', 'Email Us', 'We respond within 24 hours', '<p>Send us an email for non-urgent inquiries, prescription refills, or general questions about our services.</p><p><strong>Email:</strong> info@lifebloom.com</p>', 'Send Email', 'mailto:info@lifebloom.com', 'secondary-green', true, 1),
('map-pin', 'Visit Us', 'Located in the heart of Balipara', '<p>Visit our pharmacy and healthcare center for in-person consultations and services.</p><p><strong>Address:</strong> Balipara, Tezpur, Assam</p>', 'Get Directions', 'https://maps.google.com', 'accent-teal', true, 2),
('clock', 'Opening Hours', 'Emergency services 24/7', '<p><strong>Regular Hours:</strong></p><ul><li>Monday - Friday: 9:00 AM - 8:00 PM</li><li>Saturday: 9:00 AM - 6:00 PM</li><li>Sunday: 10:00 AM - 4:00 PM</li></ul><p><strong>Emergency services available 24/7</strong></p>', 'View Schedule', 'https://lifebloom.com/hours', 'neutral-gray', true, 3);
*/

-- ============================================================================
-- DONE! The contact_cards table is now ready
-- ============================================================================
-- You can now:
-- ✅ Manage contact cards from /admin/contact-cards
-- ✅ View published cards on the frontend
-- ============================================================================
