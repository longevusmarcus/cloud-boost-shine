import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Activity, ArrowRight, TrendingUp, Calendar, Flame, UserCircle } from "lucide-react";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!profileData) {
        navigate('/');
        return;
      }

      setProfile(profileData);

      const today = format(new Date(), "yyyy-MM-dd");
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle();

      setTodayLog(logData);

      const { data: logsData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .limit(30);

      setRecentLogs(logsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const loggedDates = new Set(recentLogs.map(log => log.date));

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header - Mobile only */}
        <div className="md:hidden flex items-center justify-between pb-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <UserCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-base">🔔</span>
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="relative">
            <div className="flex items-center gap-1 mb-2 px-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {daysInMonth.map((day, idx) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                const isLogged = loggedDates.has(dateStr);
                const isPast = day < today;
                const dayNum = format(day, "d");

                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all text-xs md:text-sm ${
                      isToday
                        ? 'bg-black text-white'
                        : isLogged
                        ? 'bg-gray-900 text-white'
                        : isPast
                        ? 'border-2 border-gray-200 text-gray-300'
                        : 'border-2 border-dashed border-gray-300 text-gray-400'
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Circle - Sperm Value */}
        <div className="flex justify-center py-2">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-gray-200 opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 rounded-full bg-gray-200 opacity-10 animate-pulse" style={{ animationDuration: '2s' }} />

            {/* Main Circle */}
            <div className="relative w-52 h-52 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center shadow-lg">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-[10px] md:text-xs text-gray-600 font-medium">Sperm Value</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl md:text-xl font-bold text-gray-900">$</span>
                <span className="text-4xl md:text-5xl font-bold text-gray-900">{(profile?.sperm_value || 50).toLocaleString()}</span>
              </div>

              {/* Small stats below */}
              <div className="flex gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                    <Flame className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                  </div>
                  <div className="text-base md:text-lg font-bold text-gray-900">{profile?.current_streak || 0}</div>
                  <div className="text-[9px] text-gray-600">streak</div>
                </div>
                <div className="text-center">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                  </div>
                  <div className="text-base md:text-lg font-bold text-gray-900">{profile?.sperm_level || 1}</div>
                  <div className="text-[9px] text-gray-600">level</div>
                </div>
              </div>
            </div>

            {/* Floating Sperm Animations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-2 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-40">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 4, 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute top-6 right-3 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-30">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 12, 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute bottom-8 left-4 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-25">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q14 6, 18 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute bottom-10 right-2 animate-float" style={{ animationDelay: '3s', animationDuration: '5.5s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-35">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 10, 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Check-in */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-900" />
            <h2 className="text-base md:text-lg font-bold text-gray-900">Today's Check-in</h2>
          </div>

          {todayLog ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✅</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm md:text-base">All set for today!</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Keep up the great work</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm md:text-base mb-3">Ready to log your daily metrics?</p>
              <Button 
                onClick={() => navigate('/tracking')}
                className="bg-black hover:bg-gray-800 text-white rounded-xl px-6"
              >
                Log Today <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
