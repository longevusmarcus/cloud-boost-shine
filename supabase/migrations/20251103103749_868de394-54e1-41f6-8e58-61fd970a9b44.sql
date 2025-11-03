-- Drop any existing INSERT policies on notifications
DROP POLICY IF EXISTS "Only backend can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Backend can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only service role can insert notifications" ON public.notifications;

-- Create a strict policy that only allows authenticated service role
-- This ensures ONLY backend edge functions with service_role key can insert
CREATE POLICY "Restrict notifications insert to service role"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only allow if the request is authenticated as service_role
  auth.jwt()->>'role' = 'service_role'
);