import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Activity, TrendingUp, Flame, Calendar, UserCircle, Moon, Apple, Heart, Droplet, Sun } from "lucide-react";
import Layout from "@/components/Layout";
import FloatingChatbot from "@/components/dashboard/FloatingChatbot";
import { useTheme } from "@/components/ThemeProvider";
import { decryptDailyLog } from "@/lib/encryption";
import { useAuditLog } from "@/hooks/useAuditLog";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logAction } = useAuditLog();

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

      // Decrypt today's log
      const decryptedTodayLog = logData ? await decryptDailyLog(logData, session.user.id) : null;
      setTodayLog(decryptedTodayLog);

      const { data: logsData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .limit(30);

      // Decrypt recent logs
      const decryptedLogs = await Promise.all(
        (logsData || []).map(log => decryptDailyLog(log, session.user.id))
      );
      setRecentLogs(decryptedLogs);

      // Log audit trail
      await logAction({
        action: 'VIEW',
        tableName: 'daily_logs',
        details: 'Viewed dashboard'
      });
    } catch (error) {
      console.error('Error loading data:', error);
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
      <div className="max-w-3xl mx-auto space-y-6 pt-24 md:pt-0">
        {/* Floating Icons - Mobile Only */}
        <div className="fixed top-4 left-4 right-4 z-50 md:hidden flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg"
          >
            {profile?.profile_image_url ? (
              <img 
                src={profile.profile_image_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg">
              <span className="text-base">🔔</span>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="relative mt-6">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Today</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {daysInMonth.map((day, idx) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isLogged = loggedDates.has(dateStr);
              const isPast = day < today;
              const dayNum = format(day, "d");
              
              const yesterdayDate = new Date(today);
              yesterdayDate.setDate(yesterdayDate.getDate() - 1);
              const isYesterday = format(day, "yyyy-MM-dd") === format(yesterdayDate, "yyyy-MM-dd");

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-xs ${
                    isToday
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : isYesterday && isLogged
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : isLogged && isPast
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      : isPast
                      ? 'border-2 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                      : 'border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Circle - Sperm Value */}
        <div className="flex justify-center py-4">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 opacity-10 animate-pulse" style={{ animationDuration: '2s' }} />

            {/* Main Circle */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center shadow-lg border border-transparent dark:border-gray-700">
              <div className="flex items-center gap-1 mb-2">
                <Activity className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Sperm Value</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">$</span>
                <span className="text-6xl font-bold text-gray-900 dark:text-white">{(profile?.sperm_value || 50).toLocaleString()}</span>
              </div>

              {/* Small stats below */}
              <div className="flex gap-10">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-1 shadow-sm border border-transparent dark:border-gray-700">
                    <Flame className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{profile?.current_streak || 0}</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400">streak</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-1 shadow-sm border border-transparent dark:border-gray-700">
                    <TrendingUp className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{profile?.sperm_level || 1}</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400">level</div>
                </div>
              </div>
            </div>

            {/* Floating Sperm Animations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-2 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-300 opacity-40">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 4, 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute top-6 right-3 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-300 opacity-30">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 12, 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute bottom-8 left-4 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-300 opacity-25">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q14 6, 18 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div className="absolute bottom-10 right-2 animate-float" style={{ animationDelay: '3s', animationDuration: '5.5s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-300 opacity-35">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 10, 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* Sperm entering and exploding animations */}
              {/* From left - head faces right toward center */}
              <div className="absolute -left-20 top-1/2 animate-enter-explode" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-500 dark:text-gray-400">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 6, 22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* From right - rotated 180° so head faces left toward center */}
              <div className="absolute -right-20 top-1/3 animate-enter-explode" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-500 dark:text-gray-400" style={{ transform: 'rotate(180deg)' }}>
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 6, 22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* From top - rotated 90° so head faces down toward center */}
              <div className="absolute left-1/3 -top-20 animate-enter-explode" style={{ animationDelay: '3s', animationDuration: '3.2s' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-gray-500 dark:text-gray-400" style={{ transform: 'rotate(90deg)' }}>
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 6, 22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* From bottom - rotated -90° so head faces up toward center */}
              <div className="absolute right-1/4 -bottom-20 animate-enter-explode" style={{ animationDelay: '4.5s', animationDuration: '3s' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-500 dark:text-gray-400" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 6, 22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Feed Section */}
        <div>
          <h2 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white mb-3">My Daily Feed</h2>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Log Check-in Card */}
            <button
              onClick={() => navigate('/tracking')}
              className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-500 transition-all duration-200 p-3 md:p-5 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 md:mb-3">
                {todayLog ? (
                  <span className="text-xl md:text-3xl">✓</span>
                ) : (
                  <span className="text-xl md:text-3xl">📝</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-center text-[11px] md:text-sm mb-0.5">
                {todayLog ? "Today's Log" : "Log check-in"}
              </h3>
              <p className="text-[9px] md:text-xs text-gray-600 dark:text-gray-400 text-center">
                {todayLog ? "View details" : "Track today"}
              </p>
            </button>

            {/* Today's Stats Card */}
            <div className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-2 border-gray-200 dark:border-gray-700 p-3 md:p-5 flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white text-[11px] md:text-sm mb-2">Today&apos;s stats</h3>
              {todayLog ? (
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Droplet className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-[11px] md:text-sm text-gray-900 dark:text-white font-medium">{todayLog.masturbation_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-[11px] md:text-sm text-gray-900 dark:text-white font-medium">{todayLog.sleep_hours || 0}h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Apple className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-[11px] md:text-sm text-gray-900 dark:text-white font-medium">{todayLog.diet_quality || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-1.5">📊</div>
                  <p className="text-[9px] md:text-xs text-gray-600 dark:text-gray-400 text-center">No data yet</p>
                  <p className="text-[8px] md:text-xs text-gray-500 dark:text-gray-500 text-center mt-0.5">Log today</p>
                </div>
              )}
            </div>

            {/* Progress Preview Card */}
            <div className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-2 border-gray-700 dark:border-gray-800 p-3 md:p-5 flex flex-col">
              <h3 className="font-semibold text-white text-[11px] md:text-sm mb-2">Progress</h3>
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Circular progress indicator */}
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${((profile?.sperm_value || 50) / 5000) * 251} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs md:text-sm font-bold text-white">{Math.round(((profile?.sperm_value || 50) / 5000) * 100)}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="mt-2 text-[9px] md:text-xs text-white/70 hover:text-white transition-colors text-center"
              >
                View All →
              </button>
            </div>

            {/* Daily Content Card */}
            <div className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-900 p-3 md:p-5 flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white text-[11px] md:text-sm mb-2">Daily Tip</h3>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[9px] md:text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "Zinc-rich foods boost sperm production"
                </p>
              </div>
              <button
                onClick={() => navigate('/content')}
                className="mt-2 text-[9px] md:text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Chatbot */}
      <FloatingChatbot profile={profile} />
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-5deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(3deg);
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }

        @keyframes enter-explode {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          70% {
            transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(1) rotate(360deg);
            opacity: 1;
          }
          85% {
            transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(2) rotate(360deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-enter-explode {
          animation: enter-explode infinite ease-in-out;
          --enter-x: 140px;
          --enter-y: 0;
        }

        .animate-enter-explode:nth-child(5) {
          --enter-x: 140px;
          --enter-y: 0;
        }

        .animate-enter-explode:nth-child(6) {
          --enter-x: -140px;
          --enter-y: 20px;
        }

        .animate-enter-explode:nth-child(7) {
          --enter-x: 0;
          --enter-y: 140px;
        }

        .animate-enter-explode:nth-child(8) {
          --enter-x: 0;
          --enter-y: -140px;
        }
      `}</style>
    </Layout>
  );
}
