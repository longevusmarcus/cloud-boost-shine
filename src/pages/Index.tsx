import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Shield, Droplet, DollarSign } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, onboarding_completed')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name?.split(' ')[0] || 'there');
          if (profile.onboarding_completed) {
            navigate('/dashboard');
            return;
          } else {
            navigate('/onboarding');
            return;
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleStart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gray-50 overflow-auto">
      <div className="max-w-md w-full my-auto">
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-lg border border-gray-200">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-black flex items-center justify-center">
              <Droplet className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} fill="white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-black text-center mb-0.5">
            Hey {userName || 'there'}! 👋
          </h1>
          <h2 className="text-base md:text-lg font-bold text-black text-center mb-0.5">
            Welcome to Spermaxxing
          </h2>
          <p className="text-[11px] md:text-xs text-gray-600 text-center mb-3">
            Optimize your sperm health and unlock earning potential
          </p>

          {/* Features */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-[11px] mb-0.5">Track & Optimize</h3>
                <p className="text-[10px] text-gray-600 leading-tight">Monitor lifestyle factors that impact sperm health</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-[11px] mb-0.5">Gamified Progress</h3>
                <p className="text-[10px] text-gray-600 leading-tight">Earn badges, level up, and maintain streaks</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-[11px] mb-0.5">HIPAA Compliant</h3>
                <p className="text-[10px] text-gray-600 leading-tight">Your data is secure and private</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-[11px] mb-0.5">Earn Money</h3>
                <p className="text-[10px] text-gray-600 leading-tight">Monetize your sperm (coming soon)</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleStart}
            className="w-full h-10 md:h-11 text-sm font-semibold bg-black hover:bg-gray-800 text-white rounded-xl"
          >
            Start Your Journey
          </Button>

          <p className="text-[9px] text-gray-500 text-center mt-2">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
