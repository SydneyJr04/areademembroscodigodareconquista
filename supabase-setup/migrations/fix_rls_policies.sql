-- =====================================================
-- FIX RLS POLICIES FOR PROFILES AND USER_STATS
-- =====================================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- para corrigir os erros 406 (Not Acceptable)
-- =====================================================

-- 1. PROFILES TABLE
-- =====================================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Allow users to INSERT their own profile
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy: Allow users to UPDATE their own profile
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- 2. USER_STATS TABLE
-- =====================================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_stats;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_stats;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_stats;

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own stats
CREATE POLICY "user_stats_select_own"
ON user_stats FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow users to INSERT their own stats
CREATE POLICY "user_stats_insert_own"
ON user_stats FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to UPDATE their own stats
CREATE POLICY "user_stats_update_own"
ON user_stats FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. VERIFY POLICIES
-- =====================================================

-- Check profiles policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Check user_stats policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_stats';

-- =====================================================
-- IMPORTANTE: Após executar este script:
-- 1. Limpe o cache do navegador (Ctrl+Shift+Delete)
-- 2. Recarregue a aplicação (Ctrl+Shift+R)
-- 3. Faça login novamente
-- =====================================================
