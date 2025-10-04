import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-lg w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
                <p className="text-gray-600">Help us personalize your experience</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heightFeet" className="text-gray-700">Height (ft)</Label>
                  <Input
                    id="heightFeet"
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="5"
                    className="h-11 rounded-xl border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heightInches" className="text-gray-700">Height (in)</Label>
                  <Input
                    id="heightInches"
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="10"
                    className="h-11 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-700">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!age || !heightFeet || !heightInches || !weight}
                className="w-full h-11 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold"
              >
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle Questions</h2>
                <p className="text-gray-600">Help us understand your current habits</p>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p>• Do you exercise regularly?</p>
                <p>• How would you rate your diet quality?</p>
                <p>• Do you take any supplements?</p>
                <p>• How many hours of sleep do you get?</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="flex-1 h-11 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold"
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your goal?</h2>
                <p className="text-gray-600">We'll help you track progress</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-gray-700">Primary Goal</Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Improve testosterone levels, optimize fertility..."
                  className="min-h-32 rounded-xl border-gray-200"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!goal || loading}
                  className="flex-1 h-11 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold"
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
