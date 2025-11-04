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

      {/* Floating CTA Buttons */}
      <div className="flex gap-2 w-full justify-center">
        <button
          onClick={() => navigate('/pricing')}
          className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-medium border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 shadow-sm"
        >
          Increase Value
        </button>
        
        <button
          onClick={() => {
            // Show toast notification
            const toast = document.createElement('div');
            toast.textContent = 'Coming soon';
            toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm z-50 shadow-lg';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
          }}
          className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-medium border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 shadow-sm"
        >
          Sell Sperm
        </button>
      </div>
    </div>
  );
}
