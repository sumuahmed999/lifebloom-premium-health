# Admin CMS Setup - Complete Guide

## ✅ What's Been Completed

Your admin content management system is now fully functional with:

1. **Admin Panel** - Accessible at `/admin/login`
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`

2. **Content Management Pages**
   - Services Management (`/admin/services`)
   - Testimonials Management (`/admin/testimonials`)
   - Blog Posts Management (`/admin/blogs`)
   - Video Posts Management (`/admin/videos`)
   - Contact Info Management (`/admin/contact`)

3. **Features Implemented**
   - Create, Read, Update, Delete (CRUD) operations
   - Image upload with Supabase Storage
   - Rich text editor for blog content
   - Publish/Unpublish toggle
   - Bulk operations (publish, unpublish, delete)
   - Search and filtering
   - Content reordering

## 🔧 Current Setup

### Database Structure
All content is stored in Supabase with these tables:
- `services` - Healthcare services
- `testimonials` - Customer testimonials
- `blog_posts` - Blog articles
- `video_posts` - Video content
- `contact_info` - Contact information

### Public Website Integration
The public-facing components now fetch data from Supabase:
- `ServicesSection` - Displays published services
- `TestimonialsSection` - Displays published testimonials

## ⚠️ Important: Published Status

When you edit content in the admin panel, make sure the **"Published" toggle is ON** for it to appear on the public website.

### Why Content Disappears After Editing

If content disappears from the public page after editing, it's because:
1. The "Published" toggle was turned OFF during editing
2. The content was saved as a draft

### Solution

When editing content:
1. Open the edit form
2. Make your changes
3. **Ensure the "Published" toggle is ON** (checked/enabled)
4. Click Save

## 📝 Seeding Initial Data

To populate your database with the existing website content, run this SQL in Supabase SQL Editor:

```sql
-- File: supabase/seed-existing-content.sql
-- This migrates your hardcoded content to the database

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
```

## 🚀 How to Use

### Editing Existing Content

1. Login to admin panel: `http://localhost:8080/admin/login`
2. Navigate to the content type (Services, Testimonials, etc.)
3. Click the Edit icon on any item
4. Make your changes
5. **IMPORTANT: Ensure "Published" is checked**
6. Click Save
7. Refresh the public homepage to see changes

### Adding New Content

1. Click "Add [Content Type]" button
2. Fill in all required fields
3. **Set "Published" to ON**
4. Click Save
5. Content will appear on the public website

### Deleting Content

1. Select items using checkboxes
2. Click "Bulk Delete" or click individual delete icon
3. Confirm deletion

## 🔍 Troubleshooting

### Content Not Showing on Public Page

**Check these:**
1. Is the content marked as "Published"? (Check in admin panel)
2. Did you refresh the public page after saving?
3. Check browser console for errors (F12 → Console tab)

### Admin Panel Not Loading

1. Verify Supabase connection in `.env`:
   ```
   VITE_SUPABASE_URL=https://ginifvflddhsltzbroeo.supabase.co
   VITE_SUPABASE_ANON_KEY=[your-key]
   ```
2. Restart dev server: `npm run dev`

### Can't Login to Admin

1. Verify admin user exists in Supabase
2. Check credentials:
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`

## 📊 Database Access

Access your Supabase dashboard:
- URL: https://supabase.com/dashboard/project/ginifvflddhsltzbroeo
- Tables: https://supabase.com/dashboard/project/ginifvflddhsltzbroeo/editor
- SQL Editor: https://supabase.com/dashboard/project/ginifvflddhsltzbroeo/sql/new

## 🎯 Next Steps

1. **Seed the database** - Run the SQL script above to populate initial data
2. **Test editing** - Edit a service and verify it shows on the public page
3. **Add new content** - Create new services, testimonials, blog posts
4. **Upload images** - Test image upload functionality
5. **Customize** - Adjust colors, icons, and content as needed

## 💡 Tips

- Always keep "Published" ON for content you want visible
- Use the search feature to quickly find content
- Bulk operations save time when managing multiple items
- Preview blog posts before publishing
- Reorder content using up/down arrows

## 🆘 Need Help?

If content disappears after editing:
1. Go to admin panel
2. Find the content
3. Click Edit
4. Turn "Published" toggle ON
5. Save

The content will reappear on the public website!
