import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CheckCircle, FlaskConical, TrendingUp, UserCircle, Moon, Sun } from "lucide-react";
import Layout from "@/components/Layout";
import DailyLogForm from "@/components/tracking/DailyLogForm";
import TestResultUpload from "@/components/tracking/TestResultUpload";
import TestResultDisplay from "@/components/tracking/TestResultDisplay";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { encryptDailyLog, decryptDailyLog, decryptTestResult } from "@/lib/encryption";
import { useAuditLog } from "@/hooks/useAuditLog";

export default function Tracking() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [todayLog, setTodayLog] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("daily");
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

      setProfile(profileData);

      const today = format(new Date(), "yyyy-MM-dd");
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle();

      // Decrypt daily log if it exists
      const decryptedLog = logData ? await decryptDailyLog(logData, session.user.id) : null;
      setTodayLog(decryptedLog);

      const { data: resultsData } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: false });

      // Decrypt test results
      const decryptedResults = await Promise.all(
        (resultsData || []).map(result => decryptTestResult(result, session.user.id))
      );
      setTestResults(decryptedResults);

      // Log audit trail for viewing
      await logAction({
        action: 'VIEW',
        tableName: 'daily_logs',
        details: 'Viewed tracking page'
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (logData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const today = format(new Date(), "yyyy-MM-dd");
      const dataToSave = {
        user_id: session.user.id,
        date: today,
        masturbation_count: logData.masturbation_count !== null ? parseInt(logData.masturbation_count) : null,
        sleep_hours: logData.sleep_hours ? parseFloat(logData.sleep_hours) : null,
        sleep_quality: logData.sleep_quality || null,
        diet_quality: logData.diet_quality || null,
        stress_level: logData.stress_level ? parseInt(logData.stress_level) : null,
        exercise_minutes: logData.exercise_minutes ? parseInt(logData.exercise_minutes) : null,
        electrolytes: logData.electrolytes,
        notes: logData.notes || null
      };

      // Encrypt sensitive fields
      const encryptedData = await encryptDailyLog(dataToSave, session.user.id);

      if (todayLog) {
        const { error } = await supabase
          .from('daily_logs')
          .update(encryptedData)
          .eq('id', todayLog.id);

        if (error) throw error;

        await logAction({
          action: 'UPDATE',
          tableName: 'daily_logs',
          recordId: todayLog.id,
          details: 'Updated daily log'
        });
      } else {
        const { data: insertedData, error } = await supabase
          .from('daily_logs')
          .insert(encryptedData)
          .select()
          .single();

        if (error) throw error;

        await logAction({
          action: 'CREATE',
          tableName: 'daily_logs',
          recordId: insertedData?.id,
          details: 'Created daily log'
        });

        if (profile) {
          const newStreak = (profile.current_streak || 0) + 1;
          await supabase
            .from('user_profiles')
            .update({
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, profile.longest_streak || 0)
            })
            .eq('user_id', session.user.id);
        }
      }

      toast({
        title: "✓ Saved",
        description: "Daily check-in complete",
        className: "bg-black text-white border-none",
      });
      
      await loadData();
    } catch (error: any) {
      console.error("Error saving log:", error);
    }
  };

  const handleTestUpload = async () => {
    toast({
      title: "✓ Uploaded",
      description: "Test results saved successfully",
      className: "bg-black text-white border-none",
    });
    await loadData();
    setActiveTab("results");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const getNextTestDate = () => {
    if (testResults.length === 0) return null;
    const lastTestDate = new Date(testResults[0].test_date);
    const nextDate = new Date(lastTestDate);
    nextDate.setDate(nextDate.getDate() + 90);
    return nextDate;
  };

  const getDaysUntilNextTest = () => {
    const nextDate = getNextTestDate();
    if (!nextDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nextTestDate = getNextTestDate();
  const daysUntilNext = getDaysUntilNextTest();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 mt-16 md:mt-0">
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

        {/* Desktop: Full header */}
        <div className="hidden md:block mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Daily Check-in</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        {/* Tabs - TikTok Style */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setActiveTab("daily")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "daily"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Daily Log
              {activeTab === "daily" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "results"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Testing
              {testResults.length > 0 && (
                <span className="ml-1 text-xs opacity-70">({testResults.length})</span>
              )}
              {activeTab === "results" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pb-24 md:pb-6">{activeTab === "daily" ? (
          <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Daily Check-in</h1>
            <DailyLogForm
              initialData={todayLog}
              onSubmit={handleSubmit}
            />
          </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {/* Testing Roadmap */}
              <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Testing Roadmap</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Maximize your sperm value tracking</p>
                  </div>
                </div>

                {testResults.length === 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    <div className="pt-2">
                      <h4 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">🎯 Take Your First Test</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4">
                        Establish your baseline. Get a complete sperm analysis to start your optimization journey.
                      </p>
                      <TestResultUpload onUpload={handleTestUpload} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    <div className="rounded-xl p-4 md:p-5 bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white">Last Test</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{format(new Date(testResults[0].test_date), "MMM d, yyyy")}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{testResults.length}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">Total Tests</div>
                        </div>
                      </div>
                    </div>

                    {daysUntilNext !== null && (
                      <div className={`rounded-xl p-4 md:p-5 ${
                        daysUntilNext <= 0 
                          ? 'bg-green-50 dark:bg-green-950/50 border border-green-500' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}>
                        <h4 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">
                          {daysUntilNext <= 0 ? '⏰ Test Due!' : '📅 Next Quarterly Test'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-2">
                          {daysUntilNext <= 0 
                            ? 'It\'s time for your quarterly check-up to track progress!'
                            : `${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''} until your next recommended test`}
                        </p>
                        {nextTestDate && (
                          <p className="text-gray-500 dark:text-gray-500 text-xs">
                            Scheduled: {format(nextTestDate, "MMMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="pt-2">
                      <TestResultUpload onUpload={handleTestUpload} isCompact />
                    </div>

                    <div className="rounded-xl p-4 md:p-5 bg-gray-50 dark:bg-gray-800/50">
                      <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-3">💎 Testing Benefits</h4>
                      <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <li>✓ Track sperm value changes over time</li>
                        <li>✓ Measure lifestyle optimization impact</li>
                        <li>✓ Unlock achievement badges</li>
                        <li>✓ Get personalized recommendations</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Summary (if multiple tests) */}
              {testResults.length > 1 && (
                <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Your Progress</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    {(() => {
                      const latest = testResults[0];
                      const previous = testResults[1];
                      
                      const calcChange = (current: number | undefined, prev: number | undefined) => {
                        if (!current || !prev) return null;
                        if (prev === 0) return null;
                        const change = ((current - prev) / prev) * 100;
                        return change.toFixed(1);
                      };

                      const concentrationChange = calcChange(latest.concentration, previous.concentration);
                      const motilityChange = calcChange(latest.motility, previous.motility);
                      const progressiveChange = calcChange(latest.progressive_motility, previous.progressive_motility);
                      const mscChange = calcChange(latest.motile_sperm_concentration, previous.motile_sperm_concentration);

                      return (
                        <>
                          {concentrationChange !== null && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mb-1">Concentration</div>
                              <div className={`flex items-center gap-1 ${parseFloat(concentrationChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${parseFloat(concentrationChange) < 0 ? 'rotate-180' : ''}`} />
                                <span className="text-base md:text-lg font-bold truncate">{Math.abs(parseFloat(concentrationChange))}%</span>
                              </div>
                            </div>
                          )}
                          {motilityChange !== null && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mb-1">Motility</div>
                              <div className={`flex items-center gap-1 ${parseFloat(motilityChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${parseFloat(motilityChange) < 0 ? 'rotate-180' : ''}`} />
                                <span className="text-base md:text-lg font-bold truncate">{Math.abs(parseFloat(motilityChange))}%</span>
                              </div>
                            </div>
                          )}
                          {progressiveChange !== null && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mb-1">Progressive</div>
                              <div className={`flex items-center gap-1 ${parseFloat(progressiveChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${parseFloat(progressiveChange) < 0 ? 'rotate-180' : ''}`} />
                                <span className="text-base md:text-lg font-bold truncate">{Math.abs(parseFloat(progressiveChange))}%</span>
                              </div>
                            </div>
                          )}
                          {mscChange !== null && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mb-1">MSC</div>
                              <div className={`flex items-center gap-1 ${parseFloat(mscChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${parseFloat(mscChange) < 0 ? 'rotate-180' : ''}`} />
                                <span className="text-base md:text-lg font-bold truncate">{Math.abs(parseFloat(mscChange))}%</span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-3 md:mt-4">
                    View detailed results in Analytics →
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
