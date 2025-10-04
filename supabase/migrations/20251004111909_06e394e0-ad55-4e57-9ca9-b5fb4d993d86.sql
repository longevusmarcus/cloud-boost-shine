-- Fix audit log security issue
-- Remove the overly permissive INSERT policy that allows any authenticated user to insert

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- The log_audit() function with SECURITY DEFINER will continue to work
-- because it bypasses RLS policies. This ensures ONLY system functions
-- and triggers can write to audit logs, never users directly.

-- Add a comment for clarity
COMMENT ON TABLE public.audit_logs IS 'Audit logs are write-protected. Only SECURITY DEFINER functions can insert records. This prevents users from polluting audit trails.';
