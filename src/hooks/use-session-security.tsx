import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useSessionSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });
    navigate('/auth');
  }, [navigate, toast]);

  const showWarning = useCallback(() => {
    toast({
      title: "Session Expiring Soon",
      description: "Your session will expire in 5 minutes due to inactivity.",
    });
  }, [toast]);

  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer (25 minutes)
    warningRef.current = setTimeout(showWarning, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer (30 minutes)
    timeoutRef.current = setTimeout(handleLogout, SESSION_TIMEOUT);

    lastActivityRef.current = Date.now();
  }, [handleLogout, showWarning]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Only reset if more than 1 minute has passed since last activity
    if (now - lastActivityRef.current > 60000) {
      resetTimers();
    }
  }, [resetTimers]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        resetTimers();

        // Add activity listeners
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
          window.addEventListener(event, handleActivity);
        });

        return () => {
          events.forEach(event => {
            window.removeEventListener(event, handleActivity);
          });
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (warningRef.current) clearTimeout(warningRef.current);
        };
      }
    };

    checkAuth();
  }, [resetTimers, handleActivity]);

  return { resetTimers };
};
