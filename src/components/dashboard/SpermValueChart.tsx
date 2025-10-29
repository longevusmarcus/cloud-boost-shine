import { TrendingUp } from "lucide-react";
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
            className="h-full bg-gray-900 dark:bg-white transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="absolute -top-6 text-xs font-semibold text-gray-900 dark:text-white" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>
          {Math.round(percentage)}%
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/profile')}
        className="w-full py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <TrendingUp className="w-4 h-4" />
        Increase your value
      </button>
    </div>
  );
}
