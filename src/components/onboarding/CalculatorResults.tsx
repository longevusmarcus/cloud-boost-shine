
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, DollarSign } from "lucide-react";

export default function CalculatorResults({ userData, onComplete, onBack }) {
  const [value, setValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const calculateSpermValue = (data) => {
      let baseValue = 50;
      const { lifestyle_data, age } = data;

      if (age >= 20 && age <= 35) baseValue += 500;
      else if (age < 20 || age > 35) baseValue -= (Math.abs(age - 27.5) * 10);

      const smokingValues = { never: 400, quit: 200, occasionally: -200, regularly: -600 };
      baseValue += smokingValues[lifestyle_data.smoking] || 0;

      const alcoholValues = { none: 300, light: 150, moderate: -150, heavy: -500 };
      baseValue += alcoholValues[lifestyle_data.alcohol] || 0;

      const exerciseValues = { sedentary: -300, light: 0, moderate: 300, intense: 250 };
      baseValue += exerciseValues[lifestyle_data.exercise] || 0;

      const dietValues = { poor: -300, average: 0, good: 300, excellent: 500 };
      baseValue += dietValues[lifestyle_data.diet_quality] || 0;

      const sleepHours = lifestyle_data.sleep_hours || 7;
      if (sleepHours >= 7 && sleepHours <= 9) baseValue += 300;
      else baseValue -= Math.abs(8 - sleepHours) * 50;

      const stressValues = { low: 300, moderate: 0, high: -300, extreme: -500 };
      baseValue += stressValues[lifestyle_data.stress_level] || 0;

      if (lifestyle_data.tight_clothing) baseValue -= 100;
      if (lifestyle_data.hot_baths) baseValue -= 100;

      return Math.max(50, Math.min(5000, Math.round(baseValue)));
    };

    const calculated = calculateSpermValue(userData);
    setValue(calculated);
    
    let current = 0;
    const increment = calculated / 50;
    const interval = setInterval(() => {
      current += increment;
      if (current >= calculated) {
        setDisplayValue(calculated);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [userData]);

  const getValueCategory = (val) => {
    if (val >= 3500) return { label: "Premium Quality", icon: CheckCircle, color: "text-green-600" };
    if (val >= 2500) return { label: "High Value", icon: TrendingUp, color: "text-blue-600" };
    if (val >= 1500) return { label: "Standard", icon: TrendingUp, color: "text-gray-600" };
    return { label: "Needs Optimization", icon: AlertTriangle, color: "text-orange-600" };
  };

  const category = getValueCategory(value);
  const Icon = category.icon;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">Your Sperm Value</h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4">Based on your lifestyle factors</p>

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
        <h4 className="text-sm font-semibold text-black">What This Means:</h4>
        
        {value >= 3500 && (
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
            <p className="text-gray-700 text-xs">
              🎉 Premium quality! Your sperm is highly valuable. Perfect for donation or freezing. Keep up your excellent lifestyle!
            </p>
          </div>
        )}
        
        {value >= 2500 && value < 3500 && (
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
            <p className="text-gray-700 text-xs">
              💎 High value sperm! You're in great shape. Small optimizations could push you to premium tier.
            </p>
          </div>
        )}
        
        {value >= 1500 && value < 2500 && (
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
            <p className="text-gray-700 text-xs">
              👍 Standard quality. Daily tracking and lifestyle improvements can significantly increase your sperm value.
            </p>
          </div>
        )}
        
        {value < 1500 && (
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
            <p className="text-gray-700 text-xs">
              💪 Time to optimize! Our tracking and tips will help you boost your sperm value significantly.
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
