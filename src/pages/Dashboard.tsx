import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Activity, TrendingUp, Flame, Calendar, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (!profileData?.onboarding_completed) {
        navigate('/onboarding');
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
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
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Calendar Strip */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {format(today, 'MMMM yyyy')}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {daysInMonth.map((day, idx) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isLogged = loggedDates.has(dateStr);
              const isPast = day < today;
              const dayNum = format(day, "d");

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-semibold transition-all ${
                    isToday
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                      : isLogged
                      ? 'bg-primary/20 text-primary'
                      : isPast
                      ? 'border-2 border-border text-muted-foreground/30'
                      : 'border-2 border-dashed border-border text-muted-foreground'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Stats Circle */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex flex-col items-center justify-center shadow-2xl border border-border">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Sperm Value</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-bold text-foreground">$</span>
                <span className="text-5xl font-bold text-foreground">
                  {(profile?.sperm_value || 50).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-8">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-1 shadow-sm">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{profile?.current_streak || 0}</div>
                  <div className="text-[9px] text-muted-foreground">streak</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-1 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{profile?.sperm_level || 1}</div>
                  <div className="text-[9px] text-muted-foreground">level</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Status */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Check-in</h3>
          {todayLog ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-foreground font-medium mb-1">All set for today!</p>
              <p className="text-sm text-muted-foreground">Your daily log is complete</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">You haven't logged your daily metrics yet</p>
              <Button 
                onClick={() => navigate('/tracking')}
                className="rounded-xl"
              >
                Log Today <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
