import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TrendingUp, Calendar, Activity, Moon, UserCircle, FileText, Zap } from "lucide-react";
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

        {/* Activity Summary */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Summary</h2>
          <div className="space-y-4">
            {/* Avg Exercise */}
            <div className="flex items-center gap-4 py-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900">Avg Exercise</div>
                <div className="text-gray-600 text-base">{avgExercise} min/day</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900">Current Streak</div>
                <div className="text-gray-600 text-base">{profile?.current_streak || 0} days</div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900">Best Streak</div>
                <div className="text-gray-600 text-base">{profile?.longest_streak || 0} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Trends */}
        {logs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sleep Trends</h2>
            <p className="text-gray-600 text-sm mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500">No sleep data</div>
              ) : (
                logs.map((log, index) => {
                  const maxSleep = 12;
                  const height = ((log.sleep_hours || 0) / maxSleep) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-2 max-w-[40px]">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                        <div 
                          className="absolute bottom-0 w-full bg-gray-900 rounded-t-lg transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-xs text-gray-500">
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
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stress Levels</h2>
            <p className="text-gray-600 text-sm mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500">No stress data</div>
              ) : (
                logs.map((log, index) => {
                  const maxStress = 10;
                  const height = ((log.stress_level || 0) / maxStress) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-2 max-w-[40px]">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                        <div 
                          className="absolute bottom-0 w-full bg-gray-900 rounded-t-lg transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-xs text-gray-500">
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
