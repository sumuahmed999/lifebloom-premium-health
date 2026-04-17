# How to Run SQL in Supabase Dashboard (Step-by-Step)

## The Problem
You need to run the SQL file to create the database table for "Get in Touch" content editing, but you can't use Supabase CLI.

## The Solution
Use the Supabase Dashboard web interface instead. Here's exactly how:

---

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Log in with your account
3. Click on your project (the one for LifeBloom)

### Step 2: Open SQL Editor
1. Look at the left sidebar
2. Find and click on **"SQL Editor"** (it has a database icon)
3. Click the **"New query"** button (top right)

### Step 3: Copy the SQL Code
1. Open the file: `RUN_THIS_IN_SUPABASE.sql` (in your project root)
2. Select ALL the text in that file (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 4: Paste and Run
1. Go back to the Supabase SQL Editor tab
2. Paste the SQL code into the editor (Ctrl+V or Cmd+V)
3. Click the **"Run"** button (or press Ctrl+Enter)

### Step 5: Check for Success
You should see a message like:
- ✅ "Success. No rows returned"
- OR ✅ "Success" with some green indicator

If you see an error, read it carefully - it might say the table already exists (which is fine!).

---

## Step 6: Test the Feature

### 6.1: Start Your Dev Server
```bash
npm run dev
```

### 6.2: Go to Admin Panel
Open in browser: **http://localhost:8080/admin**

### 6.3: Find "Get in Touch" Menu
- Look in the left sidebar
- Find **"Get in Touch"** (has a message circle icon 💬)
- Click on it

### 6.4: Edit Content
1. Click **"Edit Content"** button
2. You should see a form with these fields:
   - Badge Text
   - Main Heading
   - Description
   - Intro Heading
   - Intro Description
3. Change any text you want
4. Click **"Save Changes"**

### 6.5: View on Homepage
1. Go to: **http://localhost:8080**
2. Scroll down to the **Contact section**
3. You should see your updated text!

---

## Troubleshooting

### "Nothing content to edit"
This means the SQL hasn't been run yet. Go back to Step 1 and run the SQL in Supabase Dashboard.

### "Table already exists" error
That's fine! It means the table was already created. Just proceed to Step 6 to test.

### Can't find SQL Editor
- Make sure you're logged into Supabase Dashboard
- Make sure you've selected your project
- Look for the icon that looks like a database or code editor

### Still having issues?
1. Check browser console (F12) for errors
2. Make sure you're logged in as admin
3. Try refreshing the page

---

## What This Feature Does

Once set up, you can edit all the text in the "Get in Touch" section without touching code:
- Section heading and description
- Intro text
- Badge text
- Everything updates instantly on the homepage

No more editing code files! 🎉
