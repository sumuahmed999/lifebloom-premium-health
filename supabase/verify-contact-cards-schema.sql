-- Verification script for contact_cards table schema
-- Run this in Supabase SQL Editor to verify the migration was applied correctly

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'contact_cards'
) AS table_exists;

-- Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'contact_cards'
ORDER BY ordinal_position;

-- Check constraints
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'contact_cards';

-- Check indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'contact_cards';

-- Check RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'contact_cards';

-- Check RLS policies
SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'contact_cards';

-- Check triggers
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'contact_cards';
