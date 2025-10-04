import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleComplete = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_profiles')
        .update({
          age: parseInt(age),
          goal,
          onboarding_completed: true
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Setup complete!",
        description: "Let's start your optimization journey",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Tell us about yourself</h2>
                <p className="text-muted-foreground">Help us personalize your experience</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="h-12 rounded-xl"
                />
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!age}
                className="w-full h-12 rounded-xl"
              >
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">What's your goal?</h2>
                <p className="text-muted-foreground">We'll help you track progress</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Improve testosterone levels, optimize fertility..."
                  className="min-h-32 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!goal || loading}
                  className="flex-1 h-12 rounded-xl"
                >
                  {loading ? "Loading..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
