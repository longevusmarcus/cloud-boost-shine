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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      // Validate email
      const emailResult = authSchema.pick({ email: true }).safeParse({ email: resetEmail });
      
      if (!emailResult.success) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setResetLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });

      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      const errorMessage = sanitizeError(error);
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
              <Droplet className="w-7 h-7 text-white dark:text-black" strokeWidth={2} fill="white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white text-center mb-1">
            {showForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            {showForgotPassword ? "Enter your email to receive a reset link" : isSignUp ? "Start optimizing your health" : "Sign in to continue"}
          </p>

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                  placeholder="Enter your email"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold"
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
