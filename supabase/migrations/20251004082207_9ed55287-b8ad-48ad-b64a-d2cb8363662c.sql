-- Add missing columns to daily_logs table to match GitHub structure
ALTER TABLE public.daily_logs 
ADD COLUMN IF NOT EXISTS masturbation_count integer,
ADD COLUMN IF NOT EXISTS diet_quality text,
ADD COLUMN IF NOT EXISTS sleep_quality text,
ADD COLUMN IF NOT EXISTS electrolytes boolean,
ADD COLUMN IF NOT EXISTS food_photos text[];

-- Remove columns that aren't in the GitHub version
ALTER TABLE public.daily_logs 
DROP COLUMN IF EXISTS water_intake,
DROP COLUMN IF EXISTS supplements_taken;

-- Add missing columns to test_results table
ALTER TABLE public.test_results
ADD COLUMN IF NOT EXISTS provider text,
ADD COLUMN IF NOT EXISTS concentration numeric,
ADD COLUMN IF NOT EXISTS motility numeric,
ADD COLUMN IF NOT EXISTS progressive_motility numeric,
ADD COLUMN IF NOT EXISTS motile_sperm_concentration numeric,
ADD COLUMN IF NOT EXISTS progressive_motile_sperm_concentration numeric,
ADD COLUMN IF NOT EXISTS morphology numeric,
ADD COLUMN IF NOT EXISTS volume numeric,
ADD COLUMN IF NOT EXISTS file_url text;

-- Remove old columns from test_results
ALTER TABLE public.test_results
DROP COLUMN IF EXISTS sperm_count,
DROP COLUMN IF EXISTS sperm_motility,
DROP COLUMN IF EXISTS sperm_morphology,
DROP COLUMN IF EXISTS testosterone_total,
DROP COLUMN IF EXISTS testosterone_free;