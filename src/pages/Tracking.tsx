import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, CheckCircle, FlaskConical, UserCircle } from "lucide-react";
import Layout from "@/components/Layout";

export default function Tracking() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [todayLog, setTodayLog] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [sleepHours, setSleepHours] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [supplementsTaken, setSupplementsTaken] = useState(false);
  const [stressLevel, setStressLevel] = useState("3");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (todayLog) {
      setSleepHours(todayLog.sleep_hours?.toString() || "");
      setWaterIntake(todayLog.water_intake?.toString() || "");
      setExerciseMinutes(todayLog.exercise_minutes?.toString() || "");
      setSupplementsTaken(todayLog.supplements_taken || false);
      setStressLevel(todayLog.stress_level?.toString() || "3");
      setNotes(todayLog.notes || "");
    }
  }, [todayLog]);

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

      setTodayLog(logData);

      const { data: resultsData } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: false });

      setTestResults(resultsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const today = format(new Date(), "yyyy-MM-dd");
      const logData = {
        user_id: session.user.id,
        date: today,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
        water_intake: waterIntake ? parseInt(waterIntake) : null,
        exercise_minutes: exerciseMinutes ? parseInt(exerciseMinutes) : null,
        supplements_taken: supplementsTaken,
        stress_level: parseInt(stressLevel),
        notes
      };

      if (todayLog) {
        const { error } = await supabase
          .from('daily_logs')
          .update(logData)
          .eq('id', todayLog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('daily_logs')
          .insert(logData);

        if (error) throw error;

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

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        loadData();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-200 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Saved! 🎉</h2>
          <p className="text-gray-600">Your daily check-in is complete</p>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-gray-50 px-4 pt-3 pb-2 md:p-6">
            <div className="flex items-center justify-between md:hidden mb-3">
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Daily Check-in</h1>
              <p className="text-sm md:text-base text-gray-600">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 px-4 md:px-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("daily")}
                className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                  activeTab === "daily"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                }`}
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Daily Log
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                  activeTab === "results"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                }`}
              >
                <FlaskConical className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Testing
                {testResults.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white text-gray-900 text-xs font-bold">
                    {testResults.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 md:px-6 pb-24 md:pb-6 overflow-y-auto">
            {activeTab === "daily" ? (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sleep" className="text-gray-700">Sleep (hours)</Label>
                      <Input
                        id="sleep"
                        type="number"
                        step="0.5"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        className="h-11 rounded-xl border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="water" className="text-gray-700">Water (oz)</Label>
                      <Input
                        id="water"
                        type="number"
                        value={waterIntake}
                        onChange={(e) => setWaterIntake(e.target.value)}
                        className="h-11 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise" className="text-gray-700">Exercise (min)</Label>
                      <Input
                        id="exercise"
                        type="number"
                        value={exerciseMinutes}
                        onChange={(e) => setExerciseMinutes(e.target.value)}
                        className="h-11 rounded-xl border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stress" className="text-gray-700">Stress (1-5)</Label>
                      <Input
                        id="stress"
                        type="number"
                        min="1"
                        max="5"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(e.target.value)}
                        className="h-11 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Label htmlFor="supplements" className="text-gray-700">Took supplements today</Label>
                    <Switch
                      id="supplements"
                      checked={supplementsTaken}
                      onCheckedChange={setSupplementsTaken}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional observations..."
                      className="min-h-24 rounded-xl border-gray-200"
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold">
                    {todayLog ? "Update Log" : "Save Log"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Testing Roadmap</h3>
                      <p className="text-gray-600 text-sm">Maximize your sperm value tracking</p>
                    </div>
                  </div>

                  {testResults.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">🎯 Take Your First Test</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Establish your baseline. Get a complete sperm analysis to start your optimization journey.
                      </p>
                      <p className="text-xs text-gray-500">Contact your healthcare provider for testing options.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">Last Test</h4>
                            <p className="text-gray-600 text-sm">{format(new Date(testResults[0].test_date), "MMM d, yyyy")}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">{testResults.length}</div>
                            <div className="text-gray-600 text-xs">Total Tests</div>
                          </div>
                        </div>
                      </div>

                      {daysUntilNext !== null && (
                        <div className={`rounded-2xl p-6 border-2 ${
                          daysUntilNext <= 0
                            ? 'bg-green-50 border-green-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            {daysUntilNext <= 0 ? '⏰ Test Due!' : '📅 Next Quarterly Test'}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {daysUntilNext <= 0
                              ? 'It\'s time for your quarterly check-up to track progress!'
                              : `${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''} until your next recommended test`}
                          </p>
                          {nextTestDate && (
                            <p className="text-gray-500 text-xs mb-4">
                              Scheduled: {format(nextTestDate, "MMMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">💎 Testing Benefits</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>✓ Track sperm value changes over time</li>
                          <li>✓ Measure lifestyle optimization impact</li>
                          <li>✓ Unlock achievement badges</li>
                          <li>✓ Get personalized recommendations</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
