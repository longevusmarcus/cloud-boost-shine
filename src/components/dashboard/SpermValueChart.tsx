import { TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          onClick={() => navigate('/pricing')}
          className="py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(0,0,0,0.6)] dark:shadow-[0_0_30px_rgba(255,255,255,0.5)] dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] animate-pulse hover:scale-105 relative overflow-hidden"
        >
          {/* Highlight glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-black/20 animate-pulse" />
          
          <TrendingUp className="w-5 h-5 relative z-10" />
          <div className="text-center leading-tight relative z-10">
            <div className="text-sm">Increase</div>
            <div className="text-sm">your value</div>
          </div>
        </button>
        
        <button
          disabled
          className="py-3 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-sm flex flex-col items-center justify-center border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Sell</span>
          </div>
          <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400">Not available yet</span>
        </button>
      </div>
    </div>
  );
}
