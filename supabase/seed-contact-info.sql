-- Seed script for contact_info table
-- This populates the contact_info table with initial data

-- Delete existing contact info (if any)
DELETE FROM contact_info;

-- Insert default contact information
INSERT INTO contact_info (
  address,
  primary_phone,
  secondary_phone,
  email,
  operating_hours
) VALUES (
  'Balipara, Tezpur
Assam 784101
India',
  '+91 8638904234',
  NULL,
  'info@lifebloom.com',
  '{
    "Monday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Tuesday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Wednesday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Thursday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Friday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Saturday": {"open": "8:00 AM", "close": "10:00 PM", "closed": false},
    "Sunday": {"open": "9:00 AM", "close": "6:00 PM", "closed": true}
  }'::jsonb
);
