import { Brain, TrendingUp, Heart, AlertCircle } from "lucide-react";
import { calculateSpermValuation, calculateBMIRange, getAgeRange } from "@/lib/sperm-valuation";

interface PersonalizedInsightsProps {
  profile: any;
}

export default function PersonalizedInsights({ profile }: PersonalizedInsightsProps) {
  // Recalculate scores to get detailed insights
  const getInsights = () => {
    if (!profile?.age || !profile?.height_feet || !profile?.weight) {
      return null;
    }

    // Parse lifestyle data
    const lifestyleData = typeof profile.lifestyle_data === 'string' 
      ? JSON.parse(profile.lifestyle_data) 
      : profile.lifestyle_data;

    if (!lifestyleData) return null;

    const bmiRange = calculateBMIRange(
      profile.height_feet,
      profile.height_inches || 0,
      profile.weight
    );
    const ageRange = getAgeRange(profile.age);

    const result = calculateSpermValuation({
      ageRange,
      educationLevel: lifestyleData.educationLevel,
      recipientFamilies: lifestyleData.recipientFamilies,
      transparencyLevel: lifestyleData.transparencyLevel,
      bmiRange,
      testosteroneUse: lifestyleData.testosteroneUse,
      smokingDrugs: lifestyleData.smokingDrugs,
      stressLevel: lifestyleData.stressLevel,
      ejaculationFreq: lifestyleData.ejaculationFreq,
    });

    return result;
  };

  const insights = getInsights();
  
  if (!insights) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Insights</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Complete your profile to see personalized insights.</p>
      </div>
    );
  }

  const { demographicScore, involvementScore, spermHealthScore, overallScore, estimatedSpermValue } = insights;

  // Generate specific insights
  const generateInsights = () => {
    const tips = [];

    // Demographic insights
    if (demographicScore < 0.8) {
      tips.push({
        icon: Brain,
        title: "Education Impact",
        message: "Advanced education positively correlates with sperm value. Consider pursuing additional certifications or degrees.",
        color: "text-blue-600 dark:text-blue-400"
      });
    }

    // Involvement insights
    if (involvementScore < 0.7) {
      tips.push({
        icon: Heart,
        title: "Increase Your Value",
        message: "Being more open about transparency and limiting recipient families can significantly boost your sperm value.",
        color: "text-red-600 dark:text-red-400"
      });
    } else if (involvementScore >= 0.9) {
      tips.push({
        icon: Heart,
        title: "Excellent Commitment",
        message: "Your openness and family limits show exceptional commitment, maximizing your value potential.",
        color: "text-green-600 dark:text-green-400"
      });
    }

    // Health insights
    if (spermHealthScore < 0.6) {
      tips.push({
        icon: AlertCircle,
        title: "Health Optimization",
        message: "Focus on lifestyle: reduce stress, maintain healthy BMI, avoid smoking/drugs, and optimize ejaculation frequency.",
        color: "text-orange-600 dark:text-orange-400"
      });
    } else if (spermHealthScore >= 0.8) {
      tips.push({
        icon: TrendingUp,
        title: "Peak Health",
        message: "Your lifestyle factors are excellent! Maintain your current habits for optimal sperm health.",
        color: "text-green-600 dark:text-green-400"
      });
    }

    // Overall performance
    if (overallScore >= 0.85) {
      tips.push({
        icon: TrendingUp,
        title: "Premium Quality",
        message: `At $${estimatedSpermValue.toLocaleString()}, you're in the top tier. Keep up your excellent habits!`,
        color: "text-green-600 dark:text-green-400"
      });
    } else if (overallScore >= 0.65) {
      tips.push({
        icon: TrendingUp,
        title: "Strong Potential",
        message: `You're doing well at $${estimatedSpermValue.toLocaleString()}. Small improvements can push you to premium tier.`,
        color: "text-blue-600 dark:text-blue-400"
      });
    } else {
      tips.push({
        icon: AlertCircle,
        title: "Growth Opportunity",
        message: `Current value: $${estimatedSpermValue.toLocaleString()}. Focus on health and involvement to reach $50K+.`,
        color: "text-orange-600 dark:text-orange-400"
      });
    }

    return tips;
  };

  const personalizedTips = generateInsights();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <Brain className="w-5 h-5 text-gray-900 dark:text-white" />
        <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">AI Insights</h3>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Score Breakdown</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-700 dark:text-gray-300">Demographics</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{Math.round(demographicScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all"
                style={{ width: `${demographicScore * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-700 dark:text-gray-300">Involvement</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{Math.round(involvementScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all"
                style={{ width: `${involvementScore * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-700 dark:text-gray-300">Sperm Health</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{Math.round(spermHealthScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all"
                style={{ width: `${spermHealthScore * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Tips */}
      {personalizedTips.map((tip, idx) => {
        const Icon = tip.icon;
        return (
          <div 
            key={idx}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700`}>
                <Icon className={`w-5 h-5 ${tip.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{tip.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{tip.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
