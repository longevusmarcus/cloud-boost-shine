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
            className="h-full transition-all duration-500 rounded-full relative"
            style={{ 
              width: `${percentage}%`,
            }}
          >
            {/* Light mode gradient (white/light purple - soft) */}
            <div className="absolute inset-0 rounded-full dark:hidden" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 30%, #f0edff 60%, #e8e3ff 85%, #e0d9ff 100%)'
            }} />
            
            {/* Dark mode gradient (dark grey/black) */}
            <div className="absolute inset-0 rounded-full hidden dark:block" style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #3f3f3f 60%, #5a5a5a 85%, #6b6b6b 100%)'
            }} />
            
            {/* Percentage text inside bar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-gray-900 dark:text-white drop-shadow-lg">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/profile')}
        className="w-full py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
      >
        <TrendingUp className="w-4 h-4" />
        Increase your value
      </button>
    </div>
  );
}
