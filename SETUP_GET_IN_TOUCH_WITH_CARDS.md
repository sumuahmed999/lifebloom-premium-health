# Get in Touch Content - Complete Setup Guide

## ✅ What's Included

The "Get in Touch" admin page now lets you edit **EVERYTHING** in the contact section:

### Section Headers
- Badge text (e.g., "Get In Touch")
- Main heading (e.g., "Contact LifeBloom")
- Description paragraph

### Intro Section
- Intro heading
- Intro description

### Contact Cards Content ⭐ NEW
- **Call Us Card**: Title + Description
- **Email Us Card**: Title + Description
- **Visit Us Card**: Title + Description
- **Opening Hours Card**: Title + Description

---

## 🚀 How to Set Up

### Step 1: Run the SQL in Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Open the file: `RUN_THIS_IN_SUPABASE.sql`
6. Copy ALL the text from that file
7. Paste it into the SQL Editor
8. Click **"Run"** (or press Ctrl+Enter)

You should see: ✅ "Success. No rows returned" or similar success message

---

## 📝 How to Edit Content

### Step 2: Go to Admin Panel

1. Start your dev server: `npm run dev`
2. Open: **http://localhost:8080/admin**
3. Click **"Get in Touch"** in the sidebar (💬 icon)

### Step 3: Edit All Content

Click the **"Edit Content"** button. You'll see a form with these sections:

#### Section Header
- Badge Text
- Main Heading  
- Description

#### Intro Section
- Intro Heading
- Intro Description

#### Contact Cards Content
- **Call Card**
  - Title (e.g., "Call Us")
  - Description (e.g., "Available during business hours...")
  
- **Email Card**
  - Title (e.g., "Email Us")
  - Description (e.g., "Send us an email...")
  
- **Visit Card**
  - Title (e.g., "Visit Us")
  - Description (e.g., "Visit our pharmacy...")
  
- **Opening Hours Card**
  - Title (e.g., "Opening Hours")
  - Description (e.g., "Emergency services available...")

### Step 4: Save and View

1. Click **"Save Changes"**
2. Go to homepage: **http://localhost:8080**
3. Scroll to the Contact section
4. All your changes will be visible!

---

## 📋 What Gets Edited Where

### Contact Info Page (`/admin/contact`)
Manages the **actual contact details**:
- Phone numbers (primary & secondary)
- Email address
- Physical address
- Operating hours schedule

### Get in Touch Page (`/admin/get-in-touch`)
Manages the **text content**:
- All headings and descriptions
- Card titles and descriptions
- Section intro text

Both work together to make the Contact section fully editable!

---

## 🎯 Example

After editing, your contact cards might show:

**Call Us**
"Available 24/7 for emergencies. Call us anytime!"

**Email Us**  
"We respond within 2 hours during business hours."

**Visit Us**
"Walk-ins welcome! No appointment needed."

**Opening Hours**
"Extended hours on weekends for your convenience."

---

## ❓ Troubleshooting

### "No content found" message
- The SQL hasn't been run yet
- Go back to Step 1 and run the SQL

### Can't see the changes on homepage
- Refresh the page (Ctrl+R or Cmd+R)
- Check browser console for errors (F12)
- Make sure you clicked "Save Changes"

### SQL Editor not found
- Make sure you're logged into Supabase Dashboard
- Make sure you selected your project
- Look for the database/code icon in the left sidebar

---

## ✨ That's It!

You can now edit all the text in your Contact section without touching any code files. Just use the admin panel!
