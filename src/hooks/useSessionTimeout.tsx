import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

export function useSessionTimeout() {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast.error('Session expired due to inactivity. Please sign in again.');
    navigate('/auth');
  }, [navigate]);

  const showWarning = useCallback(() => {
    toast.warning('Your session will expire in 5 minutes due to inactivity.');
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    const timers = (window as any)._sessionTimers;
    if (timers) {
      clearTimeout(timers.warningTimer);
      clearTimeout(timers.logoutTimer);
    }

    // Set new timers
    const warningTimer = setTimeout(showWarning, SESSION_TIMEOUT - WARNING_TIME);
    const logoutTimer = setTimeout(handleLogout, SESSION_TIMEOUT);

    (window as any)._sessionTimers = { warningTimer, logoutTimer };
  }, [handleLogout, showWarning]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Initialize timer
      resetTimer();

      // Track user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      
      const handleActivity = () => {
        resetTimer();
        // Update last activity in database
        supabase
          .from('user_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('user_id', session.user.id)
          .then();
      };

      events.forEach(event => {
        document.addEventListener(event, handleActivity);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
        
        const timers = (window as any)._sessionTimers;
        if (timers) {
          clearTimeout(timers.warningTimer);
          clearTimeout(timers.logoutTimer);
        }
      };
    };

    checkAuth();
  }, [resetTimer]);

  return { resetTimer };
}
