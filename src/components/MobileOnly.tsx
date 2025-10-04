import { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";

interface MobileOnlyProps {
  children: React.ReactNode;
}

export default function MobileOnly({ children }: MobileOnlyProps) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Mobile Only
          </h1>
          <p className="text-gray-600 mb-6">
            This app is optimized for mobile devices. Please open it on your smartphone for the best experience.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Tip:</span> Scan a QR code or send yourself the link to open on mobile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
