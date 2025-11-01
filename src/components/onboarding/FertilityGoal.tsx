import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Target, Heart, Snowflake, Gift, TrendingUp } from "lucide-react";

const goals = [
  { id: "optimize", label: "Optimize Health", icon: TrendingUp, description: "Improve overall sperm quality" },
  { id: "freeze", label: "Freeze Sperm", icon: Snowflake, description: "Preserve for future use" },
  { id: "donate", label: "Sperm Donation", icon: Gift, description: "Help others conceive" },
  { id: "conceive", label: "Conceive Now", icon: Heart, description: "Planning to have children" },
  { id: "maintain", label: "Maintain Health", icon: Target, description: "Keep current health status" }
];

export default function FertilityGoal({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected) {
      onNext({ fertility_goal: selected });
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">Your Goal</h2>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-5">What brings you here today?</p>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className={`border-2 rounded-2xl p-4 text-left transition-all duration-200 ${
                isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-black' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-sm">{goal.label}</h3>
                  <p className="text-xs text-gray-600">{goal.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 sm:gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 border-gray-300 text-black hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}