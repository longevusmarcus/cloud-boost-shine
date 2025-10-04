-- Add comprehensive RLS policies for audit_logs to prevent any direct user access
-- Only SECURITY DEFINER functions (like log_audit) can write to this table

-- Block all INSERT attempts from users (only SECURITY DEFINER functions can bypass this)
CREATE POLICY "Block direct INSERT to audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block all UPDATE attempts (audit logs should be immutable)
CREATE POLICY "Block UPDATE to audit logs"
ON public.audit_logs
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Block all DELETE attempts (audit logs should be permanent)
CREATE POLICY "Block DELETE from audit logs"
ON public.audit_logs
FOR DELETE
TO authenticated
USING (false);

-- Add comments for clarity
COMMENT ON POLICY "Block direct INSERT to audit logs" ON public.audit_logs IS 'Prevents users from inserting audit logs directly. Only SECURITY DEFINER functions can write.';
COMMENT ON POLICY "Block UPDATE to audit logs" ON public.audit_logs IS 'Audit logs are immutable - no updates allowed.';
COMMENT ON POLICY "Block DELETE from audit logs" ON public.audit_logs IS 'Audit logs are permanent - no deletions allowed for compliance.';