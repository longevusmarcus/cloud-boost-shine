import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LifestyleQuiz({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    height_feet: "",
    height_inches: "",
    weight: "",
    educationLevel: "",
    recipientFamilies: "",
    transparencyLevel: "",
    testosteroneUse: "",
    smokingDrugs: "",
    stressLevel: "",
    ejaculationFreq: "",
  });

  const isComplete = () => {
    return (
      formData.height_feet &&
      formData.height_inches &&
      formData.weight &&
      formData.educationLevel &&
      formData.recipientFamilies &&
      formData.transparencyLevel &&
      formData.testosteroneUse &&
      formData.smokingDrugs &&
      formData.stressLevel &&
      formData.ejaculationFreq
    );
  };

  const handleSubmit = () => {
    if (isComplete()) {
      onNext({ lifestyle_data: formData });
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Lifestyle Assessment</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8">Help us understand your profile to calculate your sperm valuation</p>

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

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Testosterone Supplements</Label>
          <Select value={formData.testosteroneUse} onValueChange={(value) => setFormData({...formData, testosteroneUse: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No supplements">No supplements</SelectItem>
              <SelectItem value="Taking supplements">Taking supplements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Smoking / Drug Use</Label>
          <Select value={formData.smokingDrugs} onValueChange={(value) => setFormData({...formData, smokingDrugs: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No smoking/drugs">No smoking/drugs</SelectItem>
              <SelectItem value="Occasional smoking/drugs">Occasional smoking/drugs</SelectItem>
              <SelectItem value="Frequent smoking/drugs">Frequent smoking/drugs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Stress Level</Label>
          <Select value={formData.stressLevel} onValueChange={(value) => setFormData({...formData, stressLevel: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low stress">Low stress</SelectItem>
              <SelectItem value="Medium stress">Medium stress</SelectItem>
              <SelectItem value="High stress">High stress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground text-sm font-medium mb-2 block">Ejaculation Frequency</Label>
          <Select value={formData.ejaculationFreq} onValueChange={(value) => setFormData({...formData, ejaculationFreq: value})}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Multiple/day">Multiple per day</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Rarely">Rarely</SelectItem>
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
          Calculate Score
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
