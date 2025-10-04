import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-3 md:p-8">
      {/* Header */}
      <div className="fixed top-4 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-16 md:mt-0">
        {/* Desktop Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="hidden md:flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy & Terms of Service</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: October 4, 2025</p>

          {/* HIPAA Compliance */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">🔒 HIPAA Compliance</h2>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This application is designed to be HIPAA compliant. Your Protected Health Information (PHI) is encrypted at rest and in transit, 
              with comprehensive audit logging and strict access controls.
            </p>
          </div>

          {/* Privacy Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h3>
                <p className="text-sm leading-relaxed">
                  We collect health-related information you provide including fertility tracking data, lifestyle information, 
                  test results, and personal health metrics. All data is treated as Protected Health Information (PHI) under HIPAA.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Information</h3>
                <p className="text-sm leading-relaxed mb-2">Your information is used exclusively for:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Providing personalized health tracking and insights</li>
                  <li>Generating analytics and progress reports</li>
                  <li>Improving our services and user experience</li>
                  <li>Compliance with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Data Security & Encryption</h3>
                <p className="text-sm leading-relaxed mb-2">We implement industry-leading security measures:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>AES-256 encryption at rest</li>
                  <li>TLS 1.3 encryption in transit</li>
                  <li>Multi-factor authentication (MFA) support</li>
                  <li>Comprehensive audit logging of all data access</li>
                  <li>Regular security audits and penetration testing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Data Sharing</h3>
                <p className="text-sm leading-relaxed">
                  We never sell your personal health information. Your data is only shared with third parties when required by law 
                  or with your explicit consent. All service providers sign Business Associate Agreements (BAA) as required by HIPAA.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Your Rights</h3>
                <p className="text-sm leading-relaxed mb-2">Under HIPAA, you have the right to:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Access your health information</li>
                  <li>Request corrections to your data</li>
                  <li>Request restrictions on data use</li>
                  <li>Receive an accounting of disclosures</li>
                  <li>Receive a copy of this privacy policy</li>
                  <li>Delete your account and all associated data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Data Retention</h3>
                <p className="text-sm leading-relaxed">
                  We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently 
                  deleted within 30 days, except where required by law to retain certain audit logs.
                </p>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h2>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                <p className="text-sm leading-relaxed">
                  By accessing and using this service, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Medical Disclaimer</h3>
                <p className="text-sm leading-relaxed">
                  This application is for informational and tracking purposes only. It is not a substitute for professional medical advice, 
                  diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions 
                  regarding a medical condition.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibilities</h3>
                <p className="text-sm leading-relaxed mb-2">You agree to:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Enable MFA for enhanced security</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Use the service in compliance with applicable laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Prohibited Activities</h3>
                <p className="text-sm leading-relaxed mb-2">You may not:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Attempt to breach security or authentication measures</li>
                  <li>Interfere with the proper functioning of the service</li>
                  <li>Use the service for any unlawful purpose</li>
                  <li>Share your account with others</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of the service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Changes to Terms</h3>
                <p className="text-sm leading-relaxed">
                  We reserve the right to modify these terms at any time. Material changes will be notified via email or in-app notification.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Us</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              For questions about privacy, security, or to exercise your HIPAA rights, please contact our Privacy Officer at{" "}
              <a href="mailto:privacy@spermaxxing.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@spermaxxing.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
