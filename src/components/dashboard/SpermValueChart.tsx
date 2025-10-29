import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpermValueChartProps {
  currentValue: number;
}

export default function SpermValueChart({ currentValue }: SpermValueChartProps) {
  const navigate = useNavigate();
  const maxValue = 70000;
  const percentage = (currentValue / maxValue) * 100;

  // Generate simple chart points
  const generateChartPoints = () => {
    const points = [];
    const segments = 20;
    const startValue = currentValue * 0.7;
    
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const value = startValue + (currentValue - startValue) * progress + Math.sin(progress * 6) * (currentValue * 0.05);
      points.push(value);
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const chartMax = Math.max(...chartPoints);
  const chartMin = Math.min(...chartPoints);

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Max value</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          ${currentValue.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-gray-600 dark:text-gray-400">{Math.round(percentage)}% of ${maxValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
          <polyline
            points={chartPoints.map((value, i) => {
              const x = (i / (chartPoints.length - 1)) * 300;
              const y = 100 - ((value - chartMin) / (chartMax - chartMin)) * 90;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-900 dark:text-white"
          />
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-500 dark:text-gray-500 pointer-events-none">
          <span>${(maxValue / 1000).toFixed(0)}K</span>
          <span>${((maxValue * 0.75) / 1000).toFixed(0)}K</span>
          <span>${((maxValue * 0.5) / 1000).toFixed(0)}K</span>
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
