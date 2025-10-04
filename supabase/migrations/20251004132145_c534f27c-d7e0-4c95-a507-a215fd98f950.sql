-- Add lifestyle quiz columns to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS smoking text,
ADD COLUMN IF NOT EXISTS alcohol text,
ADD COLUMN IF NOT EXISTS exercise text,
ADD COLUMN IF NOT EXISTS diet_quality text,
ADD COLUMN IF NOT EXISTS sleep_hours numeric,
ADD COLUMN IF NOT EXISTS stress_level text,
ADD COLUMN IF NOT EXISTS masturbation_frequency text,
ADD COLUMN IF NOT EXISTS sexual_activity text,
ADD COLUMN IF NOT EXISTS supplements text,
ADD COLUMN IF NOT EXISTS career_status text,
ADD COLUMN IF NOT EXISTS family_pledge text,
ADD COLUMN IF NOT EXISTS tight_clothing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hot_baths boolean DEFAULT false;

-- Add comments
COMMENT ON COLUMN public.user_profiles.smoking IS 'User smoking status';
COMMENT ON COLUMN public.user_profiles.alcohol IS 'User alcohol consumption';
COMMENT ON COLUMN public.user_profiles.exercise IS 'User exercise level';
COMMENT ON COLUMN public.user_profiles.diet_quality IS 'User diet quality';
COMMENT ON COLUMN public.user_profiles.sleep_hours IS 'Average sleep hours per night';
COMMENT ON COLUMN public.user_profiles.stress_level IS 'User stress level';
COMMENT ON COLUMN public.user_profiles.masturbation_frequency IS 'Masturbation frequency per week';
COMMENT ON COLUMN public.user_profiles.sexual_activity IS 'Sexual activity frequency per week';
COMMENT ON COLUMN public.user_profiles.supplements IS 'Supplement usage';
COMMENT ON COLUMN public.user_profiles.career_status IS 'Career or education status';
COMMENT ON COLUMN public.user_profiles.family_pledge IS 'Desired number of children';
COMMENT ON COLUMN public.user_profiles.tight_clothing IS 'Wears tight clothing frequently';
COMMENT ON COLUMN public.user_profiles.hot_baths IS 'Regularly uses hot baths/saunas';
