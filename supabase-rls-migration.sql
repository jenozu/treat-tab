-- ============================================================
-- Treat Tab - Row Level Security Migration
-- Run this in your Supabase SQL editor (Dashboard -> SQL Editor)
-- ============================================================
-- IMPORTANT: Apply this ONLY after you have created your account
-- in the app and noted your user ID from auth.users.
-- ============================================================

-- 1. Add user_id column to each table.
--    DEFAULT auth.uid() means all future inserts automatically
--    get scoped to the signed-in user with no client changes.
ALTER TABLE customers   ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE products    ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE sales       ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE sale_items  ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE payments    ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Enable Row Level Security on every table.
ALTER TABLE customers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments   ENABLE ROW LEVEL SECURITY;

-- 3. Create policies - each user can only see and modify their own rows.
CREATE POLICY "Own customers"  ON customers  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own products"   ON products   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own sales"      ON sales      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own sale_items" ON sale_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own payments"   ON payments   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Claim existing rows for your account.
--    Replace the UUID below with your actual user ID from:
--      Supabase Dashboard -> Authentication -> Users -> copy the UUID
-- UPDATE customers   SET user_id = 'YOUR-USER-UUID-HERE' WHERE user_id IS NULL;
-- UPDATE products    SET user_id = 'YOUR-USER-UUID-HERE' WHERE user_id IS NULL;
-- UPDATE sales       SET user_id = 'YOUR-USER-UUID-HERE' WHERE user_id IS NULL;
-- UPDATE sale_items  SET user_id = 'YOUR-USER-UUID-HERE' WHERE user_id IS NULL;
-- UPDATE payments    SET user_id = 'YOUR-USER-UUID-HERE' WHERE user_id IS NULL;
