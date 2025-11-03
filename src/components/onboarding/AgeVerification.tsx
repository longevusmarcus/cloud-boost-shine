import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function AgeVerification({ onNext }: { onNext: (data: any) => void }) {
  const [formData, setFormData] = useState({
    age: "",
    zipCode: ""
  });
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age);
    
    if (!formData.age || ageNum < 18) {
      setError("You must be 18 or older to use this app");
      return;
    }
    
    if (ageNum > 100) {
      setError("Please enter a valid age");
      return;
    }

    if (!formData.zipCode || formData.zipCode.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (!isChecked) {
      setError("You must confirm you are 18+ to continue");
      return;
    }

    onNext({ 
      age: ageNum,
      zipCode: formData.zipCode
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
            ZIP Code
          </Label>
          <Input
            type="text"
            value={formData.zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              setFormData({ ...formData, zipCode: value });
              setError("");
            }}
            placeholder="ZIP"
            maxLength={5}
            className="h-11 md:h-12 text-base rounded-xl"
          />
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              setError("");
            }}
            className="mt-1 w-5 h-5 rounded border-2 border-muted-foreground"
          />
          <label className="text-sm text-foreground">
            You must be 18+ to use Batch.
          </label>
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
