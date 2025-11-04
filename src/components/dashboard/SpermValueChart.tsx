import { TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SpermValueChartProps {
  currentValue: number;
}

export default function SpermValueChart({ currentValue }: SpermValueChartProps) {
  const navigate = useNavigate();
  const maxValue = 70000;
  const percentage = (currentValue / maxValue) * 100;

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Max value</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            ${maxValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 dark:from-emerald-500 dark:via-teal-400 dark:to-cyan-500 shadow-lg relative"
            style={{ 
              width: `${percentage}%`,
            }}
          >
            {/* Shine effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
            
            {/* Percentage text inside bar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white dark:text-black drop-shadow-lg">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => navigate('/pricing')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-sm font-semibold hover:scale-[1.02] transition-all shadow-md"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Increase Value</span>
        </button>
        
        <button
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "This feature will be available soon.",
            });
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-gray-900 text-black dark:text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-md border border-gray-200 dark:border-gray-700"
        >
          <DollarSign className="w-4 h-4" />
          <span>Sell Sperm</span>
        </button>
      </div>
    </div>
  );
}
