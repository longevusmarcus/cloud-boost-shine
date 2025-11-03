import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-foreground text-sm font-medium">Testosterone Supplements</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Testosterone & Fertility</p>
                  <p className="text-xs">Exogenous testosterone supplementation suppresses the pituitary gland's production of FSH and LH hormones, which are critical for sperm production. This can reduce sperm count by 90% or more. Donors not using testosterone supplements have significantly higher sperm counts and quality, increasing market value by up to 75%. Natural testosterone levels are optimal for fertility.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-foreground text-sm font-medium">Smoking / Drug Use</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Impact of Smoking & Drugs</p>
                  <p className="text-xs">Smoking reduces sperm count by 23%, decreases motility by 13%, and causes DNA fragmentation that affects embryo development. Marijuana use can reduce sperm concentration by 29%. Cocaine and other drugs severely impair sperm production and quality. Non-users command the highest premiums as recipients prioritize clean genetic material for their children's long-term health outcomes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-foreground text-sm font-medium">Stress Level</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Stress & Sperm Quality</p>
                  <p className="text-xs">Chronic stress elevates cortisol, which disrupts the hypothalamic-pituitary-gonadal axis responsible for testosterone and sperm production. High stress reduces sperm concentration by up to 38% and impairs motility. Men with low stress levels produce 25-30% more viable sperm. Stress management through exercise, meditation, and adequate sleep directly improves fertility markers and donor value.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-foreground text-sm font-medium">Ejaculation Frequency</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Optimal Ejaculation Frequency</p>
                  <p className="text-xs">Sperm quality follows a "Goldilocks principle"—too frequent reduces count, too rare increases DNA fragmentation. Daily or 2-3x weekly ejaculation optimizes both sperm count (200-500M per ejaculate) and quality with minimal DNA damage. Abstinence beyond 5 days increases oxidative stress on sperm. Multiple daily ejaculations reduce concentration by 50%+. Regular, moderate frequency maximizes donor specimen quality.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
