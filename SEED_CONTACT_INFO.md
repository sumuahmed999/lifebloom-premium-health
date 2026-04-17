# Seed Contact Information

The contact information page is empty because the database doesn't have any data yet. Follow these steps to add the initial contact information:

## Option 1: Run Seed Script in Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Insert contact information
INSERT INTO contact_info (address, primary_phone, secondary_phone, email, operating_hours)
VALUES (
  'Balipara, Tezpur',
  '+91 8638904234',
  NULL,
  'info@lifebloom.com',
  '{
    "Monday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Tuesday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Wednesday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Thursday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Friday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Saturday": {"open": "08:00 AM", "close": "10:00 PM", "closed": false},
    "Sunday": {"open": "08:00 AM", "close": "10:00 PM", "closed": true}
  }'
)
ON CONFLICT DO NOTHING;
```

5. Click **Run** or press `Ctrl+Enter`
6. Refresh your admin contact page

## Option 2: Use the Full Seed Script

If you also want to seed services and testimonials:

1. Go to Supabase SQL Editor
2. Open the file `supabase/seed-existing-content.sql`
3. Copy the entire content
4. Paste it in the SQL Editor
5. Run the script

## Verify the Data

After running the script:

1. Go to **Table Editor** in Supabase
2. Select the `contact_info` table
3. You should see one row with the contact information
4. Refresh your admin panel at `/admin/contact`
5. You should now see the contact information and be able to edit it

## What Happens Next

Once the contact information is in the database:
- The admin panel will show the contact details for editing
- The homepage contact section will automatically fetch and display this information
- Any changes you make in the admin panel will immediately reflect on the homepage
