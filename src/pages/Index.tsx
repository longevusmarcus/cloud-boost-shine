import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Shield, Droplet } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Droplet className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Spermaxxing</h1>
          <p className="text-lg text-muted-foreground">Optimize your reproductive health</p>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border mb-6">
          <div className="space-y-6">
            <FeatureItem 
              icon={<TrendingUp />}
              title="Track Daily Progress"
              description="Monitor sleep, supplements, and lifestyle factors"
            />
            <FeatureItem 
              icon={<Award />}
              title="Build Streaks"
              description="Stay consistent with your optimization routine"
            />
            <FeatureItem 
              icon={<Shield />}
              title="Lab Results"
              description="Track testosterone and sperm quality over time"
            />
          </div>
        </div>

        <Button 
          onClick={() => navigate('/auth')}
          size="lg"
          className="w-full text-lg h-14 rounded-2xl"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
        <div className="w-6 h-6 text-primary">{icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
