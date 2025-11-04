import { useState } from "react";
import { X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("lifetime");

  const plans = [
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
      <DialogContent className="max-w-md p-0 gap-0 border-0 bg-background">
        {/* Close Button */}
        <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="p-6 space-y-6">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold">
              Go Premium
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              Unlock your full sperm health potential
            </h2>
            <p className="text-sm text-muted-foreground">
              Get advanced insights and personalized recommendations to maximize your fertility.
            </p>
          </div>

          {/* Feature Card */}
          <div className="bg-accent/50 rounded-2xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Premium Features
            </h3>
            <div className="space-y-2">
              {[
                "Advanced sperm value tracking",
                "Personalized AI recommendations",
                "Detailed analytics & insights",
                "Priority support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-2.5">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio/Check */}
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                      selectedPlan === plan.id
                        ? "bg-primary"
                        : "border-2 border-muted-foreground"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground tracking-wide">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-semibold rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-lg font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
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
            className="w-full h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-base"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
