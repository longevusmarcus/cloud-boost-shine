import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function AgeVerification({ onNext }: { onNext: (data: any) => void }) {
  const [formData, setFormData] = useState({
    age: "",
    height_feet: "",
    height_inches: "",
    weight: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age);
    const heightFeet = parseInt(formData.height_feet);
    const heightInches = parseInt(formData.height_inches);
    const weight = parseInt(formData.weight);
    
    if (!formData.age || ageNum < 18) {
      setError("You must be 18 or older to use this app");
      return;
    }
    
    if (ageNum > 100) {
      setError("Please enter a valid age");
      return;
    }

    if (!formData.height_feet || heightFeet < 3 || heightFeet > 8) {
      setError("Please enter a valid height");
      return;
    }

    if (!formData.height_inches || heightInches < 0 || heightInches > 11) {
      setError("Inches must be between 0 and 11");
      return;
    }

    if (!formData.weight || weight < 50 || weight > 500) {
      setError("Please enter a valid weight");
      return;
    }

    onNext({ 
      age: ageNum,
      height_feet: heightFeet,
      height_inches: heightInches,
      weight: weight
    });
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">Basic Info</h2>
      <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4">Let's start with some basic information</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-foreground text-sm font-medium mb-1.5 block">
            What is your age?
          </Label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value });
              setError("");
            }}
            placeholder="Enter your age"
            className="h-11 md:h-12 text-base rounded-xl"
          />
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-1.5 block">
            Height
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_feet}
                onChange={(e) => {
                  setFormData({ ...formData, height_feet: e.target.value });
                  setError("");
                }}
                placeholder="Feet"
                min="3"
                max="8"
                className="h-11 md:h-12 text-base rounded-xl"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_inches}
                onChange={(e) => {
                  setFormData({ ...formData, height_inches: e.target.value });
                  setError("");
                }}
                placeholder="Inches"
                min="0"
                max="11"
                className="h-11 md:h-12 text-base rounded-xl"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-1.5 block">
            Weight (lbs)
          </Label>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => {
              setFormData({ ...formData, weight: e.target.value });
              setError("");
            }}
            placeholder="Enter your weight"
            className="h-11 md:h-12 text-base rounded-xl"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-xs md:text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 md:h-12 text-base font-semibold rounded-xl"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
}
