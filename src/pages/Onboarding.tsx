import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateSpermValuation } from "@/lib/sperm-valuation";
import AgeVerification from "@/components/onboarding/AgeVerification";
import LifestyleQuiz from "@/components/onboarding/LifestyleQuiz";
import FertilityGoal from "@/components/onboarding/FertilityGoal";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<any>({});
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

  const handleAgeVerification = (data: any) => {
    setUserData({ ...userData, ...data });
    setStep(2);
  };

  const handleFertilityGoal = (data: any) => {
    setUserData({ ...userData, ...data });
    setStep(3);
  };

  const handleLifestyleQuiz = async (data: any) => {
    const completeData = { ...userData, ...data };
    setUserData(completeData);
    await handleComplete(completeData);
  };

  const getSpermLevel = (value: number) => {
    if (value >= 50000) return 4;
    if (value >= 35000) return 3;
    if (value >= 20000) return 2;
    return 1;
  };

  const handleComplete = async (completeData: any) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const valuationResult = calculateSpermValuation(completeData);
      const spermValue = valuationResult.estimatedSpermValue;
      const spermLevel = getSpermLevel(spermValue);

      const { error } = await supabase
        .from('user_profiles')
        .upsert([{
          user_id: session.user.id,
          age: completeData.age,
          height_feet: completeData.height_feet,
          height_inches: completeData.height_inches,
          weight: completeData.weight,
          goal: completeData.fertility_goal,
          stress_level: completeData.lifestyle_data?.stressLevel,
          sperm_value: spermValue,
          sperm_level: spermLevel,
          onboarding_completed: true
        }], {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("Error saving profile:", error);
        throw error;
      }

      toast({
        title: "Setup complete!",
        description: "Let's start your optimization journey",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error in handleComplete:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-background overflow-auto">
      <div className="max-w-lg w-full my-auto">
        {/* Progress bar */}
        <div className="mb-4 md:mb-6">
          <div className="flex gap-2 mb-4">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <div className="bg-card rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border border-border">
          {step === 1 && <AgeVerification onNext={handleAgeVerification} />}
          {step === 2 && <FertilityGoal onNext={handleFertilityGoal} onBack={handleBack} />}
          {step === 3 && <LifestyleQuiz onNext={handleLifestyleQuiz} onBack={handleBack} loading={loading} />}
        </div>
      </div>
    </div>
  );
}
