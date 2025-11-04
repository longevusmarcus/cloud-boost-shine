import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("kit");

  const plans = [
    {
      id: "monthly",
      name: "MONTHLY",
      price: "$9.99",
      period: "/month",
      description: "Track your sperm health journey",
      badge: null,
    },
    {
      id: "lifetime",
      name: "LIFETIME",
      price: "$89.99",
      period: "one-time",
      description: "Unlimited access forever",
      badge: null,
    },
    {
      id: "kit",
      name: "KIT + APP",
      price: "$99.99",
      period: "one-time",
      description: "At-home test kit + lifetime app access",
      badge: "Best value",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-2 bg-gray-50 dark:bg-gray-900">
      {/* Floating Back Button - Mobile Only */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Start Your Journey
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Choose the perfect plan for your sperm health goals
            </p>
          </div>

          {/* Pricing Options */}
          <div className="space-y-2.5 mb-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${
                    selectedPlan === plan.id
                      ? "border-black dark:border-white bg-gray-50 dark:bg-gray-700"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio/Check */}
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        selectedPlan === plan.id
                          ? "bg-black dark:bg-white"
                          : "border-2 border-gray-400 dark:border-gray-500"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check className="w-3.5 h-3.5 text-white dark:text-black" strokeWidth={3} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold text-black dark:text-white tracking-wide">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-0.5">
                        <span className="text-lg font-bold text-black dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <Button
              onClick={() => navigate("/profile")}
              className="w-full h-11 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold mb-2.5 text-sm"
            >
              Continue
            </Button>

            {/* Skip Link */}
            <div className="text-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium transition-colors"
              >
                I don't want to increase my value
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
