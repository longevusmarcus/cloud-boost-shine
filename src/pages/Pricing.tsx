import { useState } from "react";
import { Check } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("lifetime");

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
      price: "$29.99",
      period: "one-time",
      description: "Unlimited access forever",
      badge: "Best value",
    },
    {
      id: "kit",
      name: "KIT + APP",
      price: "$99.99",
      period: "one-time",
      description: "At-home test kit + lifetime app access",
      badge: null,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-4 mt-12 md:mt-0">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-background rounded-3xl shadow-xl border border-border p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Start Your Journey
              </h1>
              <p className="text-xs text-muted-foreground">
                Choose the perfect plan for your sperm health goals
              </p>
            </div>

            {/* Pricing Options */}
            <div className="space-y-2.5 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${
                    selectedPlan === plan.id
                      ? "border-foreground bg-accent/50"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio/Check */}
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        selectedPlan === plan.id
                          ? "bg-foreground"
                          : "border-2 border-muted-foreground"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check className="w-3.5 h-3.5 text-background" strokeWidth={3} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold text-foreground tracking-wide">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-0.5">
                        <span className="text-lg font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
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
              className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold mb-2.5 text-sm"
            >
              Continue
            </Button>

            {/* View More Link */}
            <div className="text-center">
              <button
                onClick={() => navigate("/profile")}
                className="text-xs text-primary hover:underline font-medium"
              >
                View all features
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
