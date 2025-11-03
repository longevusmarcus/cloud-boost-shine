import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LifestyleQuiz({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    testosteroneUse: "",
    smokingDrugs: "",
    stressLevel: "",
    ejaculationFreq: "",
  });

  const isComplete = () => {
    return (
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
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
