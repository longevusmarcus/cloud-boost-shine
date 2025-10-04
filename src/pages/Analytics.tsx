import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TrendingUp, Activity, Droplet } from "lucide-react";
import Layout from "@/components/Layout";

export default function Analytics() {
  const [logs, setLogs] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      const { data: logsData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: true });

      setLogs(logsData || []);

      const { data: resultsData } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: true });

      setTestResults(resultsData || []);
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

  const avgSleep = logs.length > 0
    ? (logs.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / logs.length).toFixed(1)
    : 0;

  const avgWater = logs.length > 0
    ? Math.round(logs.reduce((sum, log) => sum + (log.water_intake || 0), 0) / logs.length)
    : 0;

  const avgExercise = logs.length > 0
    ? Math.round(logs.reduce((sum, log) => sum + (log.exercise_minutes || 0), 0) / logs.length)
    : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Avg Sleep"
            value={`${avgSleep}h`}
          />
          <StatCard
            icon={<Droplet className="w-6 h-6" />}
            label="Avg Water"
            value={`${avgWater}oz`}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Avg Exercise"
            value={`${avgExercise}min`}
          />
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity data yet</p>
              <p className="text-sm text-muted-foreground mt-1">Start logging your daily metrics</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.slice(-7).reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-secondary rounded-2xl">
                  <span className="font-medium text-foreground">
                    {format(new Date(log.date), 'MMM dd')}
                  </span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {log.sleep_hours && <span>{log.sleep_hours}h sleep</span>}
                    {log.exercise_minutes && <span>{log.exercise_minutes}min exercise</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Test Results History</h2>
            <div className="space-y-3">
              {testResults.map((result, idx) => (
                <div key={result.id} className="p-4 bg-secondary rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {format(new Date(result.test_date), 'MMM dd, yyyy')}
                    </span>
                    {idx === 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.testosterone_total && (
                      <div className="text-muted-foreground">
                        Total T: <span className="font-medium text-foreground">{result.testosterone_total}</span>
                      </div>
                    )}
                    {result.sperm_count && (
                      <div className="text-muted-foreground">
                        Sperm: <span className="font-medium text-foreground">{result.sperm_count}M</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}
