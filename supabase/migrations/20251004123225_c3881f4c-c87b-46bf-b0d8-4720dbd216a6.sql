-- Remove IP address and user agent columns from user_sessions table
-- These fields pose privacy risks and are not used in the application
ALTER TABLE public.user_sessions
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent;

-- Add comment explaining the security decision
COMMENT ON TABLE public.user_sessions IS 'Stores user session tokens and activity timestamps. IP addresses and user agents removed for privacy protection.';