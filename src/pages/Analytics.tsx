import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TrendingUp, Calendar, Activity, Droplet, Moon, UserCircle, FileText } from "lucide-react";
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
    ? (logs.reduce((acc, log) => acc + (Number(log.sleep_hours) || 0), 0) / logs.length)
    : 0;
  const avgExercise = logs.length > 0
    ? Math.round(logs.reduce((acc, log) => acc + (Number(log.exercise_minutes) || 0), 0) / logs.length)
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

        {/* Activity Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Summary</h2>
          <div className="space-y-4">
            {/* Avg Exercise */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Avg Exercise</div>
                <div className="text-gray-600">{avgExercise} min/day</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Current Streak</div>
                <div className="text-gray-600">{profile?.current_streak || 0} days</div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Best Streak</div>
                <div className="text-gray-600">{profile?.longest_streak || 0} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Trends */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sleep Trends</h2>
          <p className="text-gray-600 mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No sleep data yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Average: {avgSleep.toFixed(1)} hours/night</div>
              <div className="grid grid-cols-7 gap-2 mt-4">
                {logs.slice(-7).map((log) => (
                  <div key={log.id} className="text-center">
                    <div className="h-24 bg-gray-100 rounded-lg flex items-end justify-center p-2">
                      <div
                        className="w-full bg-gray-900 rounded"
                        style={{
                          height: `${((log.sleep_hours || 0) / 12) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {format(new Date(log.date), 'MMM dd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stress Levels */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stress Levels</h2>
          <p className="text-gray-600 mb-6">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No stress data yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {logs.slice(-7).map((log) => (
                <div key={log.id} className="text-center">
                  <div className="h-24 bg-gray-100 rounded-lg flex items-end justify-center p-2">
                    <div
                      className="w-full bg-gray-900 rounded"
                      style={{
                        height: `${((log.stress_level || 0) / 4) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {format(new Date(log.date), 'MMM dd')}
                  </div>
                </div>
              ))}
            </div>
          )}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No activity data yet</p>
              <p className="text-sm text-gray-500 mt-1">Start logging your daily metrics</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.slice(-7).reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="font-medium text-gray-900">
                    {format(new Date(log.date), 'MMM dd')}
                  </span>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {log.sleep_hours && <span>{log.sleep_hours}h sleep</span>}
                    {log.exercise_minutes && <span>{log.exercise_minutes}min exercise</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
