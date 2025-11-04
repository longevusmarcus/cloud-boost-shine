import { useState } from "react";
import { X, Check, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("kit");

  const plans = [
    {
      id: "kit",
      name: "KIT + APP",
      price: "$99.99",
      period: "one-time",
      description: "At-home test kit + lifetime app access",
      badge: "Best value",
    },
    {
      id: "lifetime",
      name: "LIFETIME",
      price: "$89.99",
      period: "one-time",
      description: "Unlimited access forever",
      badge: "SAVE 66%",
    },
    {
      id: "monthly",
      name: "MONTHLY",
      price: "$9.99",
      period: "/month",
      description: "Track your sperm health journey",
      badge: null,
    },
  ];

  const handleContinue = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto p-0 gap-0 border border-gray-200 dark:border-gray-700 bg-background">
        {/* Close Button */}
        <DialogClose className="absolute right-3 top-3 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-3 py-1.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-xs md:text-sm font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Go Premium
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1.5 md:space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              Become the sperm king 👑
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Get advanced insights and personalized recommendations to maximize your fertility.
            </p>
          </div>

          {/* Feature Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-3 md:p-4 space-y-2.5 md:space-y-3 border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
              Premium Features
            </h3>
            <div className="space-y-1.5 md:space-y-2">
              {[
                "Advanced sperm value tracking",
                "Personalized AI recommendations",
                "Detailed analytics & insights",
                "Priority support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white dark:text-black" strokeWidth={3} />
                  </div>
                  <span className="text-xs md:text-sm text-gray-900 dark:text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-2 md:space-y-2.5">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-3 md:p-3.5 rounded-2xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? "border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-2.5 md:gap-3">
                  {/* Radio/Check */}
                  <div
                    className={`flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                      selectedPlan === plan.id
                        ? "bg-gray-900 dark:bg-gray-100"
                        : "border-2 border-gray-400 dark:border-gray-600"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white dark:text-black" strokeWidth={3} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] md:text-xs font-semibold text-gray-900 dark:text-white tracking-wide">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="px-1.5 md:px-2 py-0.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-[9px] md:text-[10px] font-semibold rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-11 md:h-12 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold text-sm md:text-base"
          >
            Continue to Premium
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
