import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, DollarSign } from "lucide-react";
import { calculateSpermValuation, calculateBMIRange, getAgeRange } from "@/lib/sperm-valuation";
import type { DonorProfileInput } from "@/lib/sperm-valuation";

export default function CalculatorResults({ userData, onComplete, onBack }) {
  const [value, setValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Build the input for the valuation calculator
    const bmiRange = calculateBMIRange(
      userData.height_feet,
      userData.height_inches,
      userData.weight
    );
    const ageRange = getAgeRange(userData.age);

    const input: DonorProfileInput = {
      ageRange,
      educationLevel: userData.lifestyle_data?.educationLevel,
      recipientFamilies: userData.lifestyle_data?.recipientFamilies,
      transparencyLevel: userData.lifestyle_data?.transparencyLevel,
      bmiRange,
      testosteroneUse: userData.lifestyle_data?.testosteroneUse,
      smokingDrugs: userData.lifestyle_data?.smokingDrugs,
      stressLevel: userData.lifestyle_data?.stressLevel,
      ejaculationFreq: userData.lifestyle_data?.ejaculationFreq,
    };

    const result = calculateSpermValuation(input);
    const calculatedValue = Math.round(result.estimatedSpermValue);
    setValue(calculatedValue);
    setMessages(result.messages);
    
    // Animate the value
    let current = 0;
    const increment = calculatedValue / 50;
    const interval = setInterval(() => {
      current += increment;
      if (current >= calculatedValue) {
        setDisplayValue(calculatedValue);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [userData]);

  const getValueCategory = (val) => {
    if (val >= 50000) return { label: "Premium Quality", icon: CheckCircle, color: "text-green-600" };
    if (val >= 35000) return { label: "High Value", icon: TrendingUp, color: "text-blue-600" };
    if (val >= 20000) return { label: "Standard", icon: TrendingUp, color: "text-gray-600" };
    return { label: "Needs Optimization", icon: AlertTriangle, color: "text-orange-600" };
  };

  const category = getValueCategory(value);
  const Icon = category.icon;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">Your Sperm Value</h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4">Based on your profile and lifestyle factors</p>

      {/* Value Display with Pulsing Effect */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-3xl p-6 text-center mb-4 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
        <div className="flex justify-center">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-gray-200 opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 rounded-full bg-gray-200 opacity-10 animate-pulse" style={{ animationDuration: '2s' }} />
            
            {/* Main Circle with pulse */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-900 dark:bg-gray-800 flex items-center justify-center shadow-lg animate-pulse-gentle">
              <div className="text-center">
                <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white mx-auto mb-1" />
                <div className="text-2xl md:text-3xl font-bold text-white">{displayValue.toLocaleString()}</div>
              </div>
            </div>

            {/* Floating Sperm Animations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-40">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 4, 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              
              <div className="absolute top-8 right-4 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-30">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 12, 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              
              <div className="absolute bottom-6 left-6 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-25">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q14 6, 18 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              
              <div className="absolute bottom-8 right-2 animate-float" style={{ animationDelay: '3s', animationDuration: '5.5s' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-35">
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <path d="M12 8 Q16 10, 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center justify-center gap-2 mt-3 ${category.color}`}>
          <Icon className="w-5 h-5" />
          <h3 className="text-lg font-bold">{category.label}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Estimated Sperm Value</p>
      </div>

      {/* Recommendations */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-black">Personalized Recommendations:</h4>
        
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
              <p className="text-gray-700 text-xs">💡 {msg}</p>
            </div>
          ))
        ) : (
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
            <p className="text-gray-700 text-xs">
              🎉 Your profile is optimized! Maintain your lifestyle and consider regular testing.
            </p>
          </div>
        )}
      </div>

      {/* Test Kit CTA */}
      <div className="border border-gray-200 rounded-2xl p-3 mb-4 bg-gray-50">
        <h4 className="font-semibold text-black text-sm mb-1">Get Accurate Testing</h4>
        <p className="text-xs text-gray-600 mb-2">
          Confirm your sperm value with professional analysis
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <a
            href="https://www.hellosperm.com/products/yo-home-sperm-test"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full h-8 px-2 border-gray-300 text-black hover:bg-white rounded-lg text-[11px] sm:text-xs font-medium">
              <span className="truncate">Test Health (YO)</span>
              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
            </Button>
          </a>
          <a
            href="https://www.givelegacy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full h-8 px-2 border-gray-300 text-black hover:bg-white rounded-lg text-[11px] sm:text-xs font-medium">
              <span className="truncate">Freeze (Legacy)</span>
              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
            </Button>
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-11 border-gray-300 text-black hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => onComplete(value)}
          className="flex-1 h-11 bg-black hover:bg-gray-800 text-white rounded-xl"
        >
          Start Tracking
        </Button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-5deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(3deg);
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }

        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
