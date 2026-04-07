-- Sample data for testing admin content management
-- Run this in your Supabase SQL Editor to populate the database with test content

-- Insert sample services
INSERT INTO services (title, description, icon, features, color_scheme, published, sort_order)
VALUES 
  (
    'Prescription Services',
    'Expert prescription filling and medication counseling',
    'pill',
    '["Fast prescription filling", "Medication counseling", "Refill reminders", "Insurance processing"]',
    'blue',
    true,
    0
  ),
  (
    'Health Consultations',
    'Professional health advice and wellness consultations',
    'stethoscope',
    '["Blood pressure monitoring", "Diabetes management", "Weight management", "Nutrition advice"]',
    'green',
    true,
    1
  ),
  (
    'Immunizations',
    'Comprehensive vaccination services for all ages',
    'syringe',
    '["Flu shots", "Travel vaccines", "Childhood immunizations", "COVID-19 vaccines"]',
    'purple',
    true,
    2
  );

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_role, rating, testimonial_text, published, sort_order)
VALUES 
  (
    'Sarah Johnson',
    'Regular Customer',
    5,
    'The staff at Lifebloom Pharmacy are incredibly helpful and knowledgeable. They always take the time to answer my questions about my medications.',
    true,
    0
  ),
  (
    'Michael Chen',
    'Senior Citizen',
    5,
    'I have been coming here for years. The pharmacists are professional and caring, and they remember my name every time I visit.',
    true,
    1
  ),
  (
    'Emily Rodriguez',
    'Healthcare Worker',
    4,
    'Great pharmacy with excellent service. They are always quick with prescriptions and very thorough with their explanations.',
    true,
    2
  );

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, category, read_time, published, sort_order)
VALUES 
  (
    'Understanding Your Prescription Medications',
    'Learn how to properly read and understand your prescription labels and medication instructions.',
    '# Understanding Your Prescription Medications\n\nProperly understanding your prescription medications is crucial for your health and safety. Here are some key points to remember:\n\n## Reading Your Label\n- **Drug Name**: Both generic and brand names\n- **Dosage**: How much to take\n- **Frequency**: How often to take it\n- **Duration**: How long to continue\n\n## Important Tips\n1. Always read the label carefully\n2. Ask your pharmacist if you have questions\n3. Never share medications\n4. Store medications properly\n\nIf you have any questions about your medications, our pharmacists are always here to help!',
    'Dr. James Wilson',
    'Medication Safety',
    5,
    true,
    0
  ),
  (
    'Flu Season: What You Need to Know',
    'Essential information about flu prevention, symptoms, and when to get vaccinated.',
    '# Flu Season: What You Need to Know\n\nFlu season is here, and it''s important to protect yourself and your loved ones.\n\n## When to Get Vaccinated\nThe best time to get your flu shot is in early fall, but it''s never too late!\n\n## Who Should Get Vaccinated?\n- Everyone 6 months and older\n- Especially important for high-risk groups\n- Healthcare workers\n- Pregnant women\n\n## Prevention Tips\n- Wash hands frequently\n- Avoid touching your face\n- Stay home when sick\n- Get vaccinated\n\nVisit us today for your flu shot - no appointment necessary!',
    'Pharmacist Lisa Martinez',
    'Wellness',
    4,
    true,
    1
  );

-- Insert sample video posts
INSERT INTO video_posts (title, description, video_url, category, duration, published, sort_order)
VALUES 
  (
    'How to Use Your Inhaler Correctly',
    'A step-by-step guide to proper inhaler technique for asthma and COPD patients.',
    'https://www.youtube.com/watch?v=example1',
    'Medication Education',
    180,
    true,
    0
  ),
  (
    'Managing Diabetes: Tips from Our Pharmacist',
    'Learn essential tips for managing your diabetes, including blood sugar monitoring and medication timing.',
    'https://www.youtube.com/watch?v=example2',
    'Health Management',
    300,
    true,
    1
  );

-- Insert contact information
INSERT INTO contact_info (address, primary_phone, secondary_phone, email, operating_hours)
VALUES (
  '123 Main Street, Anytown, ST 12345',
  '(555) 123-4567',
  '(555) 123-4568',
  'info@lifebloompharmacy.com',
  '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": {"open": "10:00", "close": "16:00"},
    "sunday": {"closed": true}
  }'
)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully!' as message;
