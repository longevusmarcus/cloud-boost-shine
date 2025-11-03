import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function DonorProfile({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    height_feet: "",
    height_inches: "",
    weight: "",
    educationLevel: "",
    recipientFamilies: "",
    transparencyLevel: "",
  });

  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (formData.height_feet && formData.height_inches && formData.weight) {
      const heightInInches = Number(formData.height_feet) * 12 + Number(formData.height_inches);
      const weightLbs = Number(formData.weight);
      const calculatedBmi = (weightLbs / (heightInInches * heightInInches)) * 703;
      setBmi(Math.round(calculatedBmi * 10) / 10);
    } else {
      setBmi(null);
    }
  }, [formData.height_feet, formData.height_inches, formData.weight]);

  const isComplete = () => {
    return (
      formData.height_feet &&
      formData.height_inches &&
      formData.weight &&
      formData.educationLevel &&
      formData.recipientFamilies &&
      formData.transparencyLevel
    );
  };

  const handleSubmit = () => {
    if (isComplete()) {
      onNext({ donor_profile: formData });
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Donor Profile</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8">Help us understand your donor profile</p>

      <div className="space-y-4 sm:space-y-6 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Height</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_feet}
                onChange={(e) => setFormData({...formData, height_feet: e.target.value})}
                placeholder="Feet"
                min="3"
                max="8"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_inches}
                onChange={(e) => setFormData({...formData, height_inches: e.target.value})}
                placeholder="Inches"
                min="0"
                max="11"
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Weight (lbs)</Label>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            placeholder="Enter your weight"
            className="h-12 rounded-xl"
          />
        </div>

        {bmi && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <Label className="text-foreground text-sm font-medium mb-1 block">BMI (automatically calculated)</Label>
            <p className="text-2xl font-bold text-primary">{bmi}</p>
          </div>
        )}

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Education Level</Label>
          <Select value={formData.educationLevel} onValueChange={(value) => setFormData({...formData, educationLevel: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Post-graduate">Post-graduate</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
              <SelectItem value="College">College</SelectItem>
              <SelectItem value="High school">High school</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">How many recipient families would you serve?</Label>
          <p className="text-xs text-muted-foreground mb-2">If you were to donate sperm</p>
          <Select value={formData.recipientFamilies} onValueChange={(value) => setFormData({...formData, recipientFamilies: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 family only</SelectItem>
              <SelectItem value="Up to 5">Up to 5 families</SelectItem>
              <SelectItem value="Any number">Any number of families</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Information Sharing / Transparency</Label>
          <p className="text-xs text-muted-foreground mb-2">How much information would you share?</p>
          <Select value={formData.transparencyLevel} onValueChange={(value) => setFormData({...formData, transparencyLevel: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medical/full DNA/personal/contact">Medical/full DNA/personal/contact</SelectItem>
              <SelectItem value="Medical/full DNA/personal, no name">Medical/full DNA/personal, no name</SelectItem>
              <SelectItem value="Medical/DNA, screening only">Medical/DNA, screening only</SelectItem>
              <SelectItem value="Standard tests only">Standard tests only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete()}
          className="flex-1 h-12 rounded-xl disabled:opacity-50"
        >
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
