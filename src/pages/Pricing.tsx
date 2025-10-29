import { Check, Package } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic tracking",
    features: [
      "Daily tracking",
      "Basic analytics",
      "Progress calendar",
      "Mobile access",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "Unlock advanced insights",
    features: [
      "Everything in Free",
      "Advanced analytics",
      "AI-powered insights",
      "Personalized recommendations",
      "Export data",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Elite",
    price: "$29",
    period: "per month",
    description: "Maximum optimization",
    features: [
      "Everything in Pro",
      "1-on-1 coaching sessions",
      "Custom meal plans",
      "Supplement recommendations",
      "Lab result analysis",
      "Direct expert access",
    ],
    cta: "Go Elite",
    popular: false,
  },
  {
    name: "Lifetime",
    price: "$299",
    period: "one-time",
    description: "Pay once, optimize forever",
    features: [
      "Everything in Elite",
      "Lifetime access",
      "All future features",
      "Premium community access",
      "Annual health reports",
      "VIP support",
    ],
    cta: "Get Lifetime Access",
    popular: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Invest in your reproductive health
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-6 border-2 transition-all ${
                tier.popular
                  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white scale-105"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  tier.popular ? "text-white dark:text-black" : "text-gray-900 dark:text-white"
                }`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${
                    tier.popular ? "text-white dark:text-black" : "text-gray-900 dark:text-white"
                  }`}>
                    {tier.price}
                  </span>
                  <span className={`text-sm ${
                    tier.popular ? "text-gray-300 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {tier.period}
                  </span>
                </div>
                <p className={`text-sm ${
                  tier.popular ? "text-gray-300 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"
                }`}>
                  {tier.description}
                </p>
              </div>

              <Button
                className={`w-full mb-6 ${
                  tier.popular
                    ? "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                    : ""
                }`}
                variant={tier.popular ? "default" : "outline"}
              >
                {tier.cta}
              </Button>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      tier.popular ? "text-white dark:text-black" : "text-gray-900 dark:text-white"
                    }`} />
                    <span className={`text-sm ${
                      tier.popular ? "text-white dark:text-black" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sperm Kit Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-3xl p-8 border-2 border-gray-700 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Package className="w-16 h-16 text-gray-900 dark:text-white" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                At-Home Sperm Testing Kit
              </h2>
              <p className="text-gray-300 mb-4">
                Professional-grade testing from the comfort of your home. Get accurate results in minutes and track your progress over time.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Lab-quality results",
                  "Easy to use",
                  "Quick results in 10 minutes",
                  "Track improvements over time",
                  "Discreet packaging",
                ].map((feature) => (
                  <li key={feature} className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-white mb-1">$49</div>
                <div className="text-gray-400 text-sm">per kit</div>
              </div>
              <Button 
                className="bg-white text-black hover:bg-gray-100"
                onClick={() => navigate('/profile')}
              >
                Order Kit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
