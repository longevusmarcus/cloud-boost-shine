import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TrendingUp, Calendar, Activity, Moon, UserCircle, FileText, Zap, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import TestResultDisplay from "@/components/tracking/TestResultDisplay";

export default function Analytics() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

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

      setProfile(profileData);

      const daysToFetch = selectedPeriod === "7d" ? 7 : 30;
      const startDate = format(subDays(new Date(), daysToFetch), 'yyyy-MM-dd');

      const { data: logsData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .order('date', { ascending: true });

      setLogs(logsData || []);

      const { data: testResultsData } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: false });

      setTestResults(testResultsData || []);
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

  const avgSleep = logs.length > 0
    ? (logs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / logs.length)
    : 0;
  const avgWater = logs.length > 0
    ? Math.round(logs.reduce((acc, log) => acc + (log.water_intake || 0), 0) / logs.length)
    : 0;
  const avgExercise = logs.length > 0
    ? Math.round(logs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / logs.length)
    : 0;
  
  // Masturbation analytics
  const totalMasturbation = logs.reduce((acc, log) => acc + (Number(log.masturbation_count) || 0), 0);
  const avgMasturbationPerWeek = logs.length > 0 
    ? ((totalMasturbation / logs.length) * 7).toFixed(1)
    : 0;
  const daysWithActivity = logs.filter(log => (Number(log.masturbation_count) || 0) > 0).length;
  const activityRate = logs.length > 0 ? Math.round((daysWithActivity / logs.length) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between md:hidden pb-1">
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

        <div className="hidden md:block">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600">Your sperm value insights over time</p>
        </div>

        {/* Period Selector - TikTok Style */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setSelectedPeriod("7d")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                selectedPeriod === "7d"
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              7 Days
              {selectedPeriod === "7d" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setSelectedPeriod("30d")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                selectedPeriod === "30d"
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              30 Days
              {selectedPeriod === "30d" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Current Value */}
          <div className="bg-gray-900 rounded-3xl p-4 md:p-6 text-white">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Sperm Value</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xl font-bold">$</span>
              <span className="text-4xl md:text-4xl font-bold">{(profile?.sperm_value || 50).toLocaleString()}</span>
            </div>
            <div className="text-white/70 text-xs md:text-sm">Current Worth</div>
          </div>

          {/* Days Logged */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Days Logged</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{logs.length}</div>
            <div className="text-gray-600 text-xs md:text-sm">Total</div>
          </div>

          {/* Avg Sleep */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Moon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Avg Sleep</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{avgSleep.toFixed(1)}</div>
            <div className="text-gray-600 text-xs md:text-sm">hours/night</div>
          </div>

          {/* Avg Exercise */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Avg Exercise</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{avgExercise}</div>
            <div className="text-gray-600 text-xs md:text-sm">min/day</div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
            </div>
            {testResults.map((result) => (
              <TestResultDisplay key={result.id} result={result} />
            ))}
          </div>
        )}

        {/* Sexual Activity Analytics */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 md:p-8 border border-gray-700 overflow-hidden relative animate-fade-in">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ejaculation Analytics</h2>
                <p className="text-white/60 text-xs md:text-sm">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
              {/* Total Count */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-1">Total</div>
                <div className="text-2xl md:text-3xl font-bold text-white">{totalMasturbation}</div>
                <div className="text-white/60 text-[10px] md:text-xs mt-0.5">times</div>
              </div>

              {/* Weekly Average */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-1">Weekly Avg</div>
                <div className="text-2xl md:text-3xl font-bold text-white">{avgMasturbationPerWeek}</div>
                <div className="text-white/60 text-[10px] md:text-xs mt-0.5">per week</div>
              </div>

              {/* Activity Rate */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-1">Activity Rate</div>
                <div className="text-2xl md:text-3xl font-bold text-white">{activityRate}%</div>
                <div className="text-white/60 text-[10px] md:text-xs mt-0.5">of days</div>
              </div>
            </div>

            {/* Frequency Chart */}
            {logs.length > 0 && (
              <div>
                <div className="text-white/70 text-xs md:text-sm font-medium mb-3">Frequency Trend</div>
                <div className="h-32 md:h-40 flex items-end justify-center gap-1 md:gap-2">
                  {logs.map((log, index) => {
                    const maxCount = 5;
                    const count = Number(log.masturbation_count) || 0;
                    const height = (count / maxCount) * 100;
                    return (
                      <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px] group">
                        <div className="w-full rounded-t-lg relative h-full">
                          <div 
                            className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                            style={{ 
                              height: `${Math.max(height, count > 0 ? 5 : 0)}%`,
                              backgroundColor: count > 0 ? '#ffffff' : '#ffffff20'
                            }}
                          />
                        </div>
                        {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                          <span className="text-[10px] md:text-xs text-white/50">
                            {format(new Date(log.date), 'MMM d')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Activity Summary</h2>
          <div className="space-y-3 md:space-y-4">
            {/* Avg Exercise */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900">Avg Exercise</div>
                <div className="text-gray-600 text-sm md:text-base">{avgExercise} min/day</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-t border-gray-100">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900">Current Streak</div>
                <div className="text-gray-600 text-sm md:text-base">{profile?.current_streak || 0} days</div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-t border-gray-100">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900">Best Streak</div>
                <div className="text-gray-600 text-sm md:text-base">{profile?.longest_streak || 0} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Trends */}
        {logs.length > 0 && (
          <div className="bg-white rounded-3xl p-5 md:p-8 border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Sleep Trends</h2>
            <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">No sleep data</div>
              ) : (
                logs.map((log, index) => {
                  const maxSleep = 12;
                  const sleepValue = Number(log.sleep_hours) || 0;
                  const height = (sleepValue / maxSleep) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all"
                          style={{ 
                            height: `${Math.max(height, 2)}%`,
                            backgroundColor: '#111827'
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {format(new Date(log.date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Stress Levels */}
        {logs.length > 0 && (
          <div className="bg-white rounded-3xl p-5 md:p-8 border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Stress Levels</h2>
            <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">No stress data</div>
              ) : (
                logs.map((log, index) => {
                  const maxStress = 10;
                  const stressValue = Number(log.stress_level) || 0;
                  const height = (stressValue / maxStress) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all"
                          style={{ 
                            height: `${Math.max(height, 2)}%`,
                            backgroundColor: '#111827'
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {format(new Date(log.date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
