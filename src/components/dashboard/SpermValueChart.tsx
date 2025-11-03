import { TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface SpermValueChartProps {
  currentValue: number;
}

const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y", "MAX"] as const;
type TimeRange = typeof timeRanges[number];

// Generate mock historical data
const generateChartData = (range: TimeRange, currentValue: number) => {
  const dataPoints: { time: string; value: number }[] = [];
  const now = new Date();
  
  const configs = {
    "1D": { points: 24, interval: 60 * 60 * 1000, format: (d: Date) => d.getHours() + ":00" },
    "1W": { points: 7, interval: 24 * 60 * 60 * 1000, format: (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" }) },
    "1M": { points: 30, interval: 24 * 60 * 60 * 1000, format: (d: Date) => d.getDate().toString() },
    "3M": { points: 12, interval: 7 * 24 * 60 * 60 * 1000, format: (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
    "6M": { points: 26, interval: 7 * 24 * 60 * 60 * 1000, format: (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
    "1Y": { points: 12, interval: 30 * 24 * 60 * 60 * 1000, format: (d: Date) => d.toLocaleDateString("en-US", { month: "short" }) },
    "MAX": { points: 24, interval: 30 * 24 * 60 * 60 * 1000, format: (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }) },
  };
  
  const config = configs[range];
  const startValue = currentValue * 0.7; // Start at 70% of current value
  
  for (let i = 0; i < config.points; i++) {
    const date = new Date(now.getTime() - (config.points - i - 1) * config.interval);
    const progress = i / (config.points - 1);
    const randomVariation = (Math.random() - 0.5) * 0.1;
    const value = startValue + (currentValue - startValue) * progress + currentValue * randomVariation;
    
    dataPoints.push({
      time: config.format(date),
      value: Math.max(0, value),
    });
  }
  
  return dataPoints;
};

export default function SpermValueChart({ currentValue }: SpermValueChartProps) {
  const navigate = useNavigate();
  const maxValue = 70000;
  const percentage = (currentValue / maxValue) * 100;
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");
  
  const chartData = generateChartData(selectedRange, currentValue);
  const minValue = Math.min(...chartData.map(d => d.value));
  const maxChartValue = Math.max(...chartData.map(d => d.value));

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

      {/* Chart Section */}
      <div className="space-y-3">
        {/* Time Range Selector */}
        <div className="flex justify-center gap-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedRange === range
                  ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-800" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "currentColor", fontSize: 10 }}
                className="text-gray-500 dark:text-gray-400"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[minValue * 0.95, maxChartValue * 1.05]}
                tick={{ fill: "currentColor", fontSize: 10 }}
                className="text-gray-500 dark:text-gray-400"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#valueGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current Value Display */}
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${currentValue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Max Value: ${maxValue.toLocaleString()}
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
