-- Drop the insecure policy that allows anyone to insert notifications
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a secure policy that only allows service role to insert notifications
-- This means only backend edge functions can create notifications, not users
CREATE POLICY "Only service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add a policy to allow authenticated backend operations
-- Edge functions with service_role key can insert
CREATE POLICY "Backend can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only allow inserts if the request is coming from a service context
  -- Regular users won't be able to insert directly
  auth.role() = 'service_role'
);