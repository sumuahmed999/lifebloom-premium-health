-- Seed script to migrate existing hardcoded content to database
-- This extracts content from your React components and stores it in Supabase

-- Insert existing services from ServicesSection.tsx
INSERT INTO services (title, description, icon, features, color_scheme, published, sort_order)
VALUES 
  (
    'Prescription Medicines',
    'Wide range of authentic medications from trusted pharmaceutical brands with expert consultation.',
    'pill',
    '["Generic & Branded", "Quality Assured", "Expert Advice"]',
    'blue',
    true,
    0
  ),
  (
    'Health Checkups',
    'Comprehensive health screenings and diagnostic services for preventive healthcare.',
    'stethoscope',
    '["Full Body Checkup", "Lab Tests", "Health Reports"]',
    'green',
    true,
    1
  ),
  (
    'In-Clinic Consultation',
    'Book appointments with experienced doctors for personalized face-to-face consultation.',
    'users',
    '["Expert Doctors", "Flexible Slots", "Modern Facilities"]',
    'yellow',
    true,
    2
  ),
  (
    'Wellness Programs',
    'Personalized wellness plans and health guidance for chronic disease management.',
    'heart',
    '["Diet Plans", "Patient specific illness Monitoring"]',
    'pink',
    true,
    3
  )
ON CONFLICT DO NOTHING;

-- Insert existing testimonials from TestimonialsSection.tsx
INSERT INTO testimonials (customer_name, customer_role, image_url, rating, testimonial_text, published, sort_order)
VALUES 
  (
    'Mrinmoy Jyoti Das',
    'Regular Customer',
    'https://cdn-icons-png.flaticon.com/512/9187/9187532.png',
    5,
    'LifeBloom always has the medicines I need. The service is quick and the staff is helpful',
    true,
    0
  ),
  (
    'Sumu Ahmed',
    'Patient',
    'https://res.cloudinary.com/di2chaikk/image/upload/v1754086034/sumu_o6u9rv.jpg',
    5,
    'LifeBloom Pharmacy is my go-to place for medicines. The staff is friendly, and they always explain how to use my medicines clearly.',
    true,
    1
  ),
  (
    'Dibya Jyoti Nath',
    'Family Patient',
    'https://cdn-icons-png.flaticon.com/512/9187/9187532.png',
    5,
    'Best pharmacy in the area. Reasonable prices and supportive staff',
    true,
    2
  )
ON CONFLICT DO NOTHING;

-- Insert contact information from ContactSection.tsx
INSERT INTO contact_info (address, primary_phone, secondary_phone, email, operating_hours)
VALUES (
  'Balipara, Tezpur',
  '+91 8638904234',
  NULL,
  'info@lifebloom.com',
  '{
    "monday": {"open": "08:00", "close": "22:00"},
    "tuesday": {"open": "08:00", "close": "22:00"},
    "wednesday": {"open": "08:00", "close": "22:00"},
    "thursday": {"open": "08:00", "close": "22:00"},
    "friday": {"open": "08:00", "close": "22:00"},
    "saturday": {"open": "08:00", "close": "22:00"},
    "sunday": {"closed": false, "open": "08:00", "close": "22:00"}
  }'
)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Existing content migrated to database successfully!' as message;
SELECT 'Services: ' || COUNT(*) || ' records' as services_count FROM services;
SELECT 'Testimonials: ' || COUNT(*) || ' records' as testimonials_count FROM testimonials;
SELECT 'Contact Info: ' || COUNT(*) || ' records' as contact_count FROM contact_info;
