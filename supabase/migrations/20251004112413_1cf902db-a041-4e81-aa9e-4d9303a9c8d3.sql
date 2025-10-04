-- Add DELETE policy for user_sessions table
CREATE POLICY "Users can delete their own sessions"
ON public.user_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can delete their own sessions" ON public.user_sessions IS 'Allow users to delete their own session records';