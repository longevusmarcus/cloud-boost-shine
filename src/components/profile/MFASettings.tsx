import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Smartphone, Check, X } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

export default function MFASettings() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      const totpFactor = data?.totp?.find(factor => factor.status === 'verified');
      setMfaEnabled(!!totpFactor);
    } catch (error) {
      console.error("Error checking MFA status:", error);
    }
  };

  const enrollMFA = async () => {
    setLoading(true);
    try {
      // First, check for and remove any existing unverified factors
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const unverifiedFactors = factors?.totp?.filter(f => f.status !== 'verified') || [];
      
      for (const factor of unverifiedFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      });

      if (error) throw error;

      // Use the URI for QR code generation, not the pre-generated qr_code
      setQrCode(data.totp.uri);
      setSecret(data.totp.secret);
      setShowSetup(true);
      
      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error.message || "Failed to enable MFA");
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const factors = await supabase.auth.mfa.listFactors();
      const factorId = factors.data?.totp?.[0]?.id;

      if (!factorId) throw new Error("No MFA factor found");

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (error) throw error;

      toast.success("MFA enabled successfully!");
      setMfaEnabled(true);
      setShowSetup(false);
      setVerifyCode("");
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      const factorId = data?.totp?.find(f => f.status === 'verified')?.id;

      if (!factorId) throw new Error("No MFA factor found");

      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      toast.success("MFA disabled");
      setMfaEnabled(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to disable MFA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <CardTitle>Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security to your account with MFA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5" />
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-muted-foreground">
                {mfaEnabled ? "Currently enabled" : "Not enabled"}
              </p>
            </div>
          </div>
          {mfaEnabled ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <X className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {!showSetup && !mfaEnabled && (
          <Button
            onClick={enrollMFA}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Setting up..." : "Enable MFA"}
          </Button>
        )}

        {showSetup && !mfaEnabled && qrCode && (
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <p className="text-sm font-medium mb-3">
                1. Scan this QR code with your authenticator app
              </p>
              <div className="flex justify-center p-4 bg-white rounded">
                {qrCode && (
                  <QRCode 
                    value={qrCode} 
                    size={200}
                    level="M"
                  />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-3 mb-2">
                Or enter this code manually:
              </p>
              <code className="block p-2 bg-muted rounded text-xs break-all">
                {secret}
              </code>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyCode">
                2. Enter the 6-digit code from your app
              </Label>
              <Input
                id="verifyCode"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyMFA}
                disabled={loading || verifyCode.length !== 6}
                className="flex-1"
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSetup(false);
                  setVerifyCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {mfaEnabled && (
          <Button
            onClick={disableMFA}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? "Disabling..." : "Disable MFA"}
          </Button>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Recommended authenticator apps:</strong> Google Authenticator, 
            Microsoft Authenticator, Authy, or 1Password
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
