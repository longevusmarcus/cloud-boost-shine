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
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white text-white dark:text-black text-sm font-semibold hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl relative overflow-hidden group"
        >
          {/* Glaze effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 dark:from-black/5 dark:via-transparent dark:to-black/5"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <TrendingUp className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Increase Value</span>
        </button>
        
        <button
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "This feature will be available soon.",
            });
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-black dark:text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-lg border border-white/40 dark:border-gray-700/40 hover:bg-white/70 dark:hover:bg-gray-900/70 relative overflow-hidden group"
        >
          {/* Glassy shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent dark:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <DollarSign className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Sell Sperm</span>
        </button>
      </div>
    </div>
  );
}
