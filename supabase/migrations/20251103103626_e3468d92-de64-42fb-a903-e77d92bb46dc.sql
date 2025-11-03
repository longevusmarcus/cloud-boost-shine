-- Drop the conflicting INSERT policies on notifications table
DROP POLICY IF EXISTS "Only service role can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Backend can insert notifications" ON public.notifications;

-- Create a single, clear policy that only allows service_role to insert notifications
-- This ensures only backend edge functions can create notifications
CREATE POLICY "Only backend can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);