# Get in Touch Content Management

A new admin feature has been added to edit the "Get in Touch" section content on the homepage.

## What's New

You can now edit the following content from the admin panel:

1. **Section Header**:
   - Badge text (e.g., "Get In Touch")
   - Main heading (e.g., "Contact LifeBloom")
   - Description paragraph

2. **Intro Section**:
   - Intro heading (e.g., "Get in Touch")
   - Intro description paragraph

## How to Use

### Step 1: Run the Database Migration

First, you need to create the new database table. Go to your Supabase Dashboard:

1. Open **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/20240103000000_create_get_in_touch_content_table.sql`
3. Click **Run**

This will:
- Create the `get_in_touch_content` table
- Insert default content
- Set up proper permissions

### Step 2: Access the Admin Panel

1. Go to your admin panel: `http://localhost:8080/admin`
2. Look for the new **"Get in Touch"** menu item in the sidebar (with a message circle icon)
3. Click on it to open the Get in Touch Content page

### Step 3: Edit Content

1. Click the **"Edit Content"** button
2. Update any of the fields:
   - Badge Text
   - Main Heading
   - Description
   - Intro Heading
   - Intro Description
3. Click **"Save Changes"**

### Step 4: View Changes

1. Go to the homepage
2. Scroll to the Contact section
3. You'll see your updated content displayed

## Features

- **Real-time updates**: Changes appear immediately on the homepage
- **Single record**: Only one set of content exists (singleton pattern)
- **Fallback values**: If no content exists, default text is shown
- **Easy editing**: Simple form interface with all fields in one place

## Database Structure

The `get_in_touch_content` table has these fields:
- `badge_text`: Small badge text above the heading
- `heading`: Main section heading
- `description`: Description paragraph below heading
- `intro_heading`: Heading for the intro section
- `intro_description`: Description for the intro section
- `updated_at`: Timestamp of last update
- `updated_by`: User who made the last update

## Files Modified

1. **Database**:
   - `supabase/migrations/20240103000000_create_get_in_touch_content_table.sql` (new)

2. **Types**:
   - `src/types/admin-content.ts` (added GetInTouchContent interface)

3. **Services**:
   - `src/lib/services/ContentService.ts` (added get_in_touch table mapping)

4. **Pages**:
   - `src/pages/admin/GetInTouchContentPage.tsx` (new admin page)
   - `src/App.tsx` (added route)

5. **Components**:
   - `src/components/AdminLayout.tsx` (added menu item)
   - `src/components/ContactSection.tsx` (fetch and display content from database)

## Notes

- The Contact Info page (`/admin/contact`) manages phone numbers, email, address, and operating hours
- The Get in Touch page (`/admin/get-in-touch`) manages the section headings and descriptions
- Both work together to make the Contact section fully editable
