import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplet } from "lucide-react";
import { authSchema } from "@/lib/validation-schemas";
import { sanitizeError, checkRateLimit } from "@/lib/security-utils";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkOnboarding(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboarding = async (userId: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('user_id', userId)
      .single();

    if (profile?.onboarding_completed) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = `auth_${email}`;
    if (!checkRateLimit(rateLimitKey, 5, 300000)) { // 5 attempts per 5 minutes
      toast({
        title: "Too Many Attempts",
        description: "Please wait a few minutes before trying again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate input
      const validationData = {
        email,
        password,
        ...(isSignUp && fullName ? { full_name: fullName } : {}),
      };

      const result = authSchema.safeParse(validationData);
      
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: result.data.full_name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              { 
                user_id: data.user.id, 
                full_name: result.data.full_name,
                onboarding_completed: false 
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        toast({
          title: "Success!",
          description: "Your account has been created. Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      const errorMessage = sanitizeError(error);
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
              <Droplet className="w-7 h-7 text-white" strokeWidth={2} fill="white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-black text-center mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            {isSignUp ? "Start optimizing your health" : "Sign in to continue"}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-gray-600 hover:text-black transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
