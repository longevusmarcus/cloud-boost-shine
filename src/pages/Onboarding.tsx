import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AgeVerification from "@/components/onboarding/AgeVerification";
import LifestyleQuiz from "@/components/onboarding/LifestyleQuiz";
import FertilityGoal from "@/components/onboarding/FertilityGoal";
import CalculatorResults from "@/components/onboarding/CalculatorResults";

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

  const handleLifestyleQuiz = (data: any) => {
    // Extract height, weight from lifestyle_data and merge with userData
    const { height_feet, height_inches, weight, ...lifestyleData } = data.lifestyle_data || data;
    setUserData({ 
      ...userData, 
      height_feet, 
      height_inches, 
      weight,
      lifestyle_data: lifestyleData 
    });
    setStep(4);
  };

  const getSpermLevel = (value: number) => {
    if (value >= 50000) return 4;
    if (value >= 35000) return 3;
    if (value >= 20000) return 2;
    return 1;
  };

  const handleComplete = async (spermValue: number) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const spermLevel = getSpermLevel(spermValue);

      console.log("Saving profile data:", {
        age: userData.age,
        height_feet: userData.height_feet,
        height_inches: userData.height_inches,
        weight: userData.weight,
        goal: userData.fertility_goal,
        lifestyle_data: userData.lifestyle_data
      });

      // Store lifestyle data as JSONB for flexibility
      const lifestyleData = {
        educationLevel: userData.lifestyle_data?.educationLevel,
        recipientFamilies: userData.lifestyle_data?.recipientFamilies,
        transparencyLevel: userData.lifestyle_data?.transparencyLevel,
        testosteroneUse: userData.lifestyle_data?.testosteroneUse,
        smokingDrugs: userData.lifestyle_data?.smokingDrugs,
        stressLevel: userData.lifestyle_data?.stressLevel,
        ejaculationFreq: userData.lifestyle_data?.ejaculationFreq,
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: session.user.id,
          age: userData.age,
          height_feet: userData.height_feet,
          height_inches: userData.height_inches,
          weight: userData.weight,
          goal: userData.fertility_goal,
          smoking: userData.lifestyle_data?.smokingDrugs,
          stress_level: userData.lifestyle_data?.stressLevel,
          masturbation_frequency: userData.lifestyle_data?.ejaculationFreq,
          supplements: userData.lifestyle_data?.testosteroneUse === 'Taking supplements' ? 'yes' : 'no',
          sperm_value: spermValue,
          sperm_level: spermLevel,
          onboarding_completed: true
        }, {
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
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 4 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <div className="bg-card rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border border-border">
          {step === 1 && <AgeVerification onNext={handleAgeVerification} />}
          {step === 2 && <FertilityGoal onNext={handleFertilityGoal} onBack={handleBack} />}
          {step === 3 && <LifestyleQuiz onNext={handleLifestyleQuiz} onBack={handleBack} />}
          {step === 4 && (
            <CalculatorResults 
              userData={userData} 
              onComplete={handleComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
