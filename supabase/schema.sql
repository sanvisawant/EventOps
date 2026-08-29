-- ============================================================================
-- EVENTOPS — Supabase Database Migration & Row Level Security (RLS) Schema
-- ============================================================================

-- 1. Create Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ORGANIZER', 'JUDGE', 'PARTICIPANT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies for Profiles Table

-- Policy A: Users can view their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy B: Organizers can view all user profiles
CREATE POLICY "Organizers can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ORGANIZER'
    )
  );

-- Policy C: Users can insert their own profile record upon signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy D: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Automatic Profile Creation Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'PARTICIPANT'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute automatically upon Supabase auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUTURE SCHEMA RLS POLICIES SPECIFICATION (Prepared for Phase 2 Deployment)
-- ============================================================================
/*
-- Table: public.checkin_logs
-- RLS: Organizers can insert/read check-in logs. Participants read only their log.
CREATE POLICY "Organizers manage checkins" ON public.checkin_logs
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ORGANIZER'));

-- Table: public.support_tickets
-- RLS: Participants read/create own tickets. Organizers read/update all tickets.
CREATE POLICY "Participants manage own tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = user_id);

-- Table: public.evaluations
-- RLS: Judges insert/read assigned team scores. Organizers read all scores.
CREATE POLICY "Judges insert assigned evaluations" ON public.evaluations
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'JUDGE'));
*/
