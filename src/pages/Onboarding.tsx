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
    setUserData({ ...userData, ...data });
    setStep(4);
  };

  const calculateSpermValue = (data: any) => {
    let baseValue = 50;
    const { lifestyle_data, age } = data;

    if (age >= 20 && age <= 35) baseValue += 500;
    else if (age < 20 || age > 35) baseValue -= (Math.abs(age - 27.5) * 10);

    const smokingValues = { never: 400, quit: 200, occasionally: -200, regularly: -600 };
    baseValue += smokingValues[lifestyle_data?.smoking as keyof typeof smokingValues] || 0;

    const alcoholValues = { none: 300, light: 150, moderate: -150, heavy: -500 };
    baseValue += alcoholValues[lifestyle_data?.alcohol as keyof typeof alcoholValues] || 0;

    const exerciseValues = { sedentary: -300, light: 0, moderate: 300, intense: 250 };
    baseValue += exerciseValues[lifestyle_data?.exercise as keyof typeof exerciseValues] || 0;

    const dietValues = { poor: -300, average: 0, good: 300, excellent: 500 };
    baseValue += dietValues[lifestyle_data?.diet_quality as keyof typeof dietValues] || 0;

    const sleepHours = lifestyle_data?.sleep_hours || 7;
    if (sleepHours >= 7 && sleepHours <= 9) baseValue += 300;
    else baseValue -= Math.abs(8 - sleepHours) * 50;

    const stressValues = { low: 300, moderate: 0, high: -300, extreme: -500 };
    baseValue += stressValues[lifestyle_data?.stress_level as keyof typeof stressValues] || 0;

    if (lifestyle_data?.tight_clothing) baseValue -= 100;
    if (lifestyle_data?.hot_baths) baseValue -= 100;

    return Math.max(50, Math.min(5000, Math.round(baseValue)));
  };

  const getSpermLevel = (value: number) => {
    if (value >= 3500) return 4;
    if (value >= 2500) return 3;
    if (value >= 1500) return 2;
    return 1;
  };

  const handleComplete = async (spermValue: number) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const spermLevel = getSpermLevel(spermValue);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          age: userData.age,
          height_feet: userData.height_feet,
          height_inches: userData.height_inches,
          weight: userData.weight,
          goal: userData.fertility_goal,
          smoking: userData.lifestyle_data?.smoking,
          alcohol: userData.lifestyle_data?.alcohol,
          exercise: userData.lifestyle_data?.exercise,
          diet_quality: userData.lifestyle_data?.diet_quality,
          sleep_hours: userData.lifestyle_data?.sleep_hours,
          stress_level: userData.lifestyle_data?.stress_level,
          masturbation_frequency: userData.lifestyle_data?.masturbation_frequency,
          sexual_activity: userData.lifestyle_data?.sexual_activity,
          supplements: userData.lifestyle_data?.supplements,
          career_status: userData.lifestyle_data?.career_status,
          family_pledge: userData.lifestyle_data?.family_pledge,
          tight_clothing: userData.lifestyle_data?.tight_clothing,
          hot_baths: userData.lifestyle_data?.hot_baths,
          sperm_value: spermValue,
          sperm_level: spermLevel,
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

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gray-50 overflow-auto">
      <div className="max-w-lg w-full my-auto">
        {/* Progress bar */}
        <div className="mb-4 md:mb-6">
          <div className="flex gap-2 mb-4">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 4 ? 'bg-black' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
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
