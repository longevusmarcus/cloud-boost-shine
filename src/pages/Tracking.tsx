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
import { Calendar, CheckCircle, FlaskConical } from "lucide-react";
import Layout from "@/components/Layout";

export default function Tracking() {
  const [todayLog, setTodayLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [testResults, setTestResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const logData = {
        user_id: session.user.id,
        date: format(new Date(), "yyyy-MM-dd"),
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

        // Update streak
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('current_streak, longest_streak')
          .eq('user_id', session.user.id)
          .single();

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
        title: "Saved!",
        description: "Your daily log has been recorded",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex gap-2 bg-secondary rounded-2xl p-1">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "daily"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Daily Log
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "results"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FlaskConical className="w-4 h-4 inline mr-2" />
            Test Results
          </button>
        </div>

        {activeTab === "daily" && (
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 shadow-lg border border-border space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Daily Check-in</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep">Sleep (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water">Water (oz)</Label>
                <Input
                  id="water"
                  type="number"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Exercise (min)</Label>
                <Input
                  id="exercise"
                  type="number"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stress">Stress Level (1-5)</Label>
                <Input
                  id="stress"
                  type="number"
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <Label htmlFor="supplements">Took supplements today</Label>
              <Switch
                id="supplements"
                checked={supplementsTaken}
                onCheckedChange={setSupplementsTaken}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations..."
                className="min-h-24 rounded-xl"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full h-12 rounded-xl">
              {saving ? "Saving..." : todayLog ? "Update Log" : "Save Log"}
            </Button>
          </form>
        )}

        {activeTab === "results" && (
          <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Lab Results</h2>
            {testResults.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No test results yet</p>
                <p className="text-sm text-muted-foreground mt-1">Upload your lab results to track progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.id} className="p-4 bg-secondary rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">
                        {format(new Date(result.test_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {result.testosterone_total && (
                        <div>
                          <span className="text-muted-foreground">Total T:</span>
                          <span className="ml-2 font-medium text-foreground">{result.testosterone_total} ng/dL</span>
                        </div>
                      )}
                      {result.sperm_count && (
                        <div>
                          <span className="text-muted-foreground">Sperm Count:</span>
                          <span className="ml-2 font-medium text-foreground">{result.sperm_count}M/mL</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
