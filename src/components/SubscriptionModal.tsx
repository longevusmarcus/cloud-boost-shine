import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
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
      badge: "SAVE 66%",
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

  const handleContinue = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[95vh] p-0 gap-0 border-0 bg-background rounded-3xl">
        <div className="p-4 space-y-3 pr-10">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold">
              Go Premium
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              Become the sperm king 👑
            </h2>
            <p className="text-xs text-muted-foreground leading-tight">
              Unlock advanced insights and personalized recommendations.
            </p>
          </div>

          {/* Feature Card */}
          <div className="bg-accent/50 rounded-xl p-2.5 space-y-1.5">
            <h3 className="text-xs font-semibold text-foreground">
              Premium Features
            </h3>
            <div className="space-y-1.5">
              {[
                "Advanced sperm value tracking",
                "Personalized AI recommendations",
                "Detailed analytics & insights",
                "Priority support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2 h-2 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <span className="text-[10px] text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-1.5">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-2.5 rounded-xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Radio/Check */}
                  <div
                    className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                      selectedPlan === plan.id
                        ? "bg-primary"
                        : "border-2 border-muted-foreground"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-foreground tracking-wide">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[8px] font-semibold rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="text-sm font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-tight">
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
            className="w-full h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-xs"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
