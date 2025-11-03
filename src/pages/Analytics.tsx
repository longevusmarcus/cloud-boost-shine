import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TrendingUp, Calendar, Activity, Moon, UserCircle, FileText, Zap, Heart, Sun, TrendingDown, Minus } from "lucide-react";
import Layout from "@/components/Layout";
import TestResultDisplay from "@/components/tracking/TestResultDisplay";
import { useTheme } from "@/components/ThemeProvider";
import { decryptDailyLog, decryptTestResult } from "@/lib/encryption";
import { useAuditLog } from "@/hooks/useAuditLog";

export default function Analytics() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { logAction } = useAuditLog();

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

      // Decrypt daily logs
      const decryptedLogs = await Promise.all(
        (logsData || []).map(log => decryptDailyLog(log, session.user.id))
      );
      setLogs(decryptedLogs);

      const { data: testResultsData } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: false });

      // Decrypt test results
      const decryptedResults = await Promise.all(
        (testResultsData || []).map(result => decryptTestResult(result, session.user.id))
      );
      setTestResults(decryptedResults);

      // Log audit trail
      await logAction({
        action: 'VIEW',
        tableName: 'test_results',
        details: 'Viewed analytics page'
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

  const avgSleep = logs.length > 0
    ? (logs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / logs.length)
    : 0;
  const avgWater = logs.length > 0
    ? Math.round(logs.reduce((acc, log) => acc + (log.water_intake || 0), 0) / logs.length)
    : 0;
  const avgExercise = logs.length > 0
    ? Math.round(logs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / logs.length)
    : 0;

  // Calculate trends for masturbation and exercise
  const trends = useMemo(() => {
    if (logs.length < 2) return { masturbation: 'stable', exercise: 'stable' };
    
    const recentLogs = logs.slice(-3);
    const previousLogs = logs.slice(-6, -3);
    
    if (recentLogs.length === 0) return { masturbation: 'stable', exercise: 'stable' };
    
    const recentMasturbation = recentLogs.reduce((acc, log) => acc + (log.masturbation_count || 0), 0) / recentLogs.length;
    const previousMasturbation = previousLogs.length > 0 
      ? previousLogs.reduce((acc, log) => acc + (log.masturbation_count || 0), 0) / previousLogs.length 
      : recentMasturbation;
    
    const recentExercise = recentLogs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / recentLogs.length;
    const previousExercise = previousLogs.length > 0
      ? previousLogs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / previousLogs.length
      : recentExercise;
    
    const masturbationTrend = recentMasturbation > previousMasturbation + 0.3 ? 'up' : 
                             recentMasturbation < previousMasturbation - 0.3 ? 'down' : 'stable';
    const exerciseTrend = recentExercise > previousExercise + 5 ? 'up' : 
                         recentExercise < previousExercise - 5 ? 'down' : 'stable';
    
    return { masturbation: masturbationTrend, exercise: exerciseTrend };
  }, [logs]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 mt-16 md:mt-0">
        <div className="hidden md:block">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Your sperm value insights over time</p>
        </div>

        {/* Period Selector - TikTok Style */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setSelectedPeriod("7d")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                selectedPeriod === "7d"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              7 Days
              {selectedPeriod === "7d" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setSelectedPeriod("30d")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                selectedPeriod === "30d"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              30 Days
              {selectedPeriod === "30d" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Current Value */}
          <div className="bg-gray-900 dark:bg-gray-900 rounded-3xl p-4 md:p-6 text-white border border-gray-800 dark:border-gray-700">
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
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Days Logged</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{logs.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Total</div>
          </div>

          {/* Latest Test */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Latest Test</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {testResults.length > 0 ? format(new Date(testResults[0].test_date), 'MMM d') : 'N/A'}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              {testResults.length > 0 ? format(new Date(testResults[0].test_date), 'yyyy') : 'No tests'}
            </div>
          </div>

          {/* Tests Taken */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Tests Taken</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{testResults.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">total</div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Results</h2>
            </div>
            {testResults.map((result) => (
              <TestResultDisplay key={result.id} result={result} onDelete={loadData} />
            ))}
          </div>
        )}

        {/* Activity Summary */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Activity Summary</h2>
          <div className="space-y-3 md:space-y-4">
            {/* Tests Taken */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-white" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900 dark:text-white">Tests Taken</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{testResults.length} total</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-t border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-white" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900 dark:text-white">Current Streak</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{profile?.current_streak || 0} days</div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-t border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-white" />
              </div>
              <div className="flex-1">
                <div className="text-base md:text-xl font-semibold text-gray-900 dark:text-white">Best Streak</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{profile?.longest_streak || 0} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Trends */}
        {logs.length > 0 && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Sleep Trends</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">No sleep data</div>
              ) : (
                logs.map((log, index) => {
                  const maxSleep = 12;
                  const sleepValue = Number(log.sleep_hours) || 0;
                  const height = (sleepValue / maxSleep) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all bg-gray-900 dark:bg-white"
                          style={{ 
                            height: `${Math.max(height, 2)}%`
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
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

        {/* Masturbation Trends */}
        {logs.length > 0 && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Masturbation Trends</h2>
              <div className="flex items-center gap-1">
                {trends.masturbation === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                {trends.masturbation === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                {trends.masturbation === 'stable' && <Minus className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">No data</div>
              ) : (
                logs.map((log, index) => {
                  const maxCount = 5;
                  const countValue = Number(log.masturbation_count) || 0;
                  const height = (countValue / maxCount) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all bg-gray-900 dark:bg-white"
                          style={{ 
                            height: `${Math.max(height, 2)}%`
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
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

        {/* Exercise Trends */}
        {logs.length > 0 && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Exercise Trends</h2>
              <div className="flex items-center gap-1">
                {trends.exercise === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {trends.exercise === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                {trends.exercise === 'stable' && <Minus className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">No data</div>
              ) : (
                logs.map((log, index) => {
                  const maxMinutes = 120;
                  const minutesValue = Number(log.exercise_minutes) || 0;
                  const height = (minutesValue / maxMinutes) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all bg-gray-900 dark:bg-white"
                          style={{ 
                            height: `${Math.max(height, 2)}%`
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
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
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Stress Levels</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 md:mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            <div className="h-40 md:h-48 flex items-end justify-center gap-1 md:gap-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">No stress data</div>
              ) : (
                logs.map((log, index) => {
                  const maxStress = 10;
                  const stressValue = Number(log.stress_level) || 0;
                  const height = (stressValue / maxStress) * 100;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 md:gap-2 max-w-[32px] md:max-w-[40px]">
                      <div className="w-full rounded-t-lg relative h-full">
                        <div 
                          className="absolute bottom-0 w-full rounded-t-lg transition-all bg-gray-900 dark:bg-white"
                          style={{ 
                            height: `${Math.max(height, 2)}%`
                          }}
                        />
                      </div>
                      {(index === 0 || index === logs.length - 1 || logs.length < 8) && (
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
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
