import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LifestyleQuiz({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    smoking: "",
    alcohol: "",
    exercise: "",
    diet_quality: "",
    sleep_hours: "",
    stress_level: "",
    masturbation_frequency: "",
    sexual_activity: "",
    supplements: "",
    career_status: "",
    family_pledge: "",
    tight_clothing: false,
    hot_baths: false
  });

  const isComplete = () => {
    return formData.smoking && formData.alcohol && formData.exercise && 
           formData.diet_quality && formData.sleep_hours && formData.stress_level &&
           formData.masturbation_frequency && formData.sexual_activity && 
           formData.supplements && formData.career_status && formData.family_pledge;
  };

  const handleSubmit = () => {
    if (isComplete()) {
      onNext({ 
        lifestyle_data: {
          ...formData,
          sleep_hours: parseFloat(formData.sleep_hours) || 7
        }
      });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-2">Lifestyle Assessment</h2>
      <p className="text-gray-600 mb-8">Help us understand your current habits</p>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Smoking Status</Label>
          <Select value={formData.smoking} onValueChange={(value) => setFormData({...formData, smoking: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never smoked</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="quit">Quit smoking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Alcohol Consumption</Label>
          <Select value={formData.alcohol} onValueChange={(value) => setFormData({...formData, alcohol: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="light">Light (1-2 drinks/week)</SelectItem>
              <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
              <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Masturbation Frequency (per week)</Label>
          <Select value={formData.masturbation_frequency} onValueChange={(value) => setFormData({...formData, masturbation_frequency: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="1-2">1-2 times/week</SelectItem>
              <SelectItem value="3-5">3-5 times/week</SelectItem>
              <SelectItem value="6-10">6-10 times/week</SelectItem>
              <SelectItem value="11+">11+ times/week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Sexual Activity Frequency (per week)</Label>
          <Select value={formData.sexual_activity} onValueChange={(value) => setFormData({...formData, sexual_activity: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="1-2">1-2 times/week</SelectItem>
              <SelectItem value="3-5">3-5 times/week</SelectItem>
              <SelectItem value="6+">6+ times/week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Exercise Level</Label>
          <Select value={formData.exercise} onValueChange={(value) => setFormData({...formData, exercise: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (no exercise)</SelectItem>
              <SelectItem value="light">Light (1-2 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
              <SelectItem value="intense">Intense (5+ days/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Diet Quality</Label>
          <Select value={formData.diet_quality} onValueChange={(value) => setFormData({...formData, diet_quality: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor (fast food, processed)</SelectItem>
              <SelectItem value="average">Average (mixed diet)</SelectItem>
              <SelectItem value="good">Good (mostly whole foods)</SelectItem>
              <SelectItem value="excellent">Excellent (balanced, nutrient-rich)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Supplements Usage</Label>
          <Select value={formData.supplements} onValueChange={(value) => setFormData({...formData, supplements: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No supplements</SelectItem>
              <SelectItem value="basic">Basic (multivitamin)</SelectItem>
              <SelectItem value="fertility">Fertility-focused supplements</SelectItem>
              <SelectItem value="comprehensive">Comprehensive regimen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Average Sleep Hours</Label>
          <Input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleep_hours}
            onChange={(e) => setFormData({...formData, sleep_hours: e.target.value})}
            placeholder="e.g., 7.5"
            className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black placeholder:text-gray-400 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Stress Level</Label>
          <Select value={formData.stress_level} onValueChange={(value) => setFormData({...formData, stress_level: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Career/Education Status</Label>
          <Select value={formData.career_status} onValueChange={(value) => setFormData({...formData, career_status: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="entry">Entry-level professional</SelectItem>
              <SelectItem value="mid">Mid-career professional</SelectItem>
              <SelectItem value="senior">Senior professional</SelectItem>
              <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-2 block">Family Pledge (Child Limit)</Label>
          <p className="text-xs text-gray-600 mb-2">How many children would you ideally want to have or help have (sperm donation)?</p>
          <Select value={formData.family_pledge} onValueChange={(value) => setFormData({...formData, family_pledge: value})}>
            <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-black focus:ring-black text-black rounded-xl">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 – None</SelectItem>
              <SelectItem value="up-to-2">Up to 2 – Small family</SelectItem>
              <SelectItem value="up-to-5">Up to 5 – Medium family</SelectItem>
              <SelectItem value="up-to-10">Up to 10 – Large family</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-4">
            <Checkbox
              id="tight_clothing"
              checked={formData.tight_clothing}
              onCheckedChange={(checked) => setFormData({...formData, tight_clothing: !!checked})}
              className="border-gray-400"
            />
            <Label htmlFor="tight_clothing" className="text-black text-sm cursor-pointer">
              I frequently wear tight underwear or pants
            </Label>
          </div>

          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-4">
            <Checkbox
              id="hot_baths"
              checked={formData.hot_baths}
              onCheckedChange={(checked) => setFormData({...formData, hot_baths: !!checked})}
              className="border-gray-400"
            />
            <Label htmlFor="hot_baths" className="text-black text-sm cursor-pointer">
              I regularly take hot baths or use saunas/hot tubs
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
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
          disabled={!isComplete()}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl disabled:opacity-50"
        >
          Calculate Score
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}