-- Add height and weight columns to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS height_feet integer,
ADD COLUMN IF NOT EXISTS height_inches integer,
ADD COLUMN IF NOT EXISTS weight integer;

-- Add comments
COMMENT ON COLUMN public.user_profiles.height_feet IS 'User height in feet';
COMMENT ON COLUMN public.user_profiles.height_inches IS 'User height in inches (0-11)';
COMMENT ON COLUMN public.user_profiles.weight IS 'User weight in pounds';
