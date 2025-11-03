-- Add new columns to daily_logs table for alcohol, smoking, and testosterone tracking
ALTER TABLE daily_logs
ADD COLUMN IF NOT EXISTS alcohol boolean,
ADD COLUMN IF NOT EXISTS smoking boolean,
ADD COLUMN IF NOT EXISTS testosterone boolean;