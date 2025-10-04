import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplet } from "lucide-react";
import { passwordSchema } from "@/lib/validation";
import { sanitizeError } from "@/lib/security-utils";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid session (from the email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Invalid or Expired Link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    });
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate password strength
      const result = passwordSchema.safeParse(password);
      
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast({
          title: "Invalid Password",
          description: firstError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: result.data,
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset.",
      });

      // Redirect to dashboard after successful reset
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      const errorMessage = sanitizeError(error);
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Enter your new password below
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                placeholder="Min. 12 characters"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Must contain uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200 dark:border-gray-700"
                placeholder="Re-enter new password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>

            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
