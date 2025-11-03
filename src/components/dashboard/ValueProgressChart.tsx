import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { TrendingUp, Target, Calendar } from "lucide-react";

interface ValueProgressChartProps {
  currentValue: number;
  recentLogs: any[];
}

export default function ValueProgressChart({ currentValue, recentLogs }: ValueProgressChartProps) {
  const chartData = useMemo(() => {
    // Generate data points based on recent logs
    const data = recentLogs.slice(0, 30).reverse().map((log, index) => {
      // Simulate value progression based on lifestyle factors
      const baseValue = 50;
      const progressionFactor = index * 2;
      
      // Positive factors
      const sleepBonus = log.sleep_hours >= 7 ? 5 : 0;
      const dietBonus = log.diet_quality === 'good' || log.diet_quality === 'excellent' ? 5 : 0;
      const exerciseBonus = log.exercise_minutes >= 30 ? 3 : 0;
      const electrolyteBonus = log.electrolytes ? 2 : 0;
      
      // Negative factors
      const stressPenalty = log.stress_level > 7 ? -3 : 0;
      const masturbationPenalty = log.masturbation_count > 1 ? -2 : 0;
      
      const calculatedValue = Math.min(
        1000,
        baseValue + progressionFactor + sleepBonus + dietBonus + exerciseBonus + electrolyteBonus + stressPenalty + masturbationPenalty
      );
      
      return {
        date: log.date,
        value: calculatedValue,
        hasLog: true,
        masturbation: log.masturbation_count,
        sleep: log.sleep_hours,
        diet: log.diet_quality,
      };
    });
    
    // Add current value as the last point
    if (data.length > 0) {
      data.push({
        date: format(new Date(), "yyyy-MM-dd"),
        value: currentValue,
        hasLog: true,
        masturbation: 0,
        sleep: 0,
        diet: 'N/A',
      });
    }
    
    return data;
  }, [recentLogs, currentValue]);

  const maxValue = 1000;
  const progress = (currentValue / maxValue) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${currentValue}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Max</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${maxValue}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Your Journey</span>
          <span className="font-semibold">${currentValue} / ${maxValue}</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gray-400 via-gray-600 to-black dark:from-gray-500 dark:via-gray-300 dark:to-white transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>$0</span>
          <span>$250</span>
          <span>$500</span>
          <span>$750</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Value Progression</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(0, 0, 0)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="valueGradientDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(255, 255, 255)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="rgb(255, 255, 255)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                stroke="rgb(156, 163, 175)"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                stroke="rgb(156, 163, 175)"
                style={{ fontSize: '11px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg">
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                          {format(new Date(data.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          ${data.value}
                        </p>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <p>💧 Masturbation: {data.masturbation}</p>
                          <p>😴 Sleep: {data.sleep}h</p>
                          <p>🥗 Diet: {data.diet}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgb(0, 0, 0)"
                strokeWidth={3}
                fill="url(#valueGradient)"
                className="dark:stroke-white"
                dot={{
                  fill: 'rgb(0, 0, 0)',
                  r: 4,
                  strokeWidth: 2,
                  stroke: 'rgb(255, 255, 255)',
                  className: 'dark:fill-white dark:stroke-gray-900'
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 3,
                  className: 'cursor-pointer'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Milestones */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Next Milestones</h3>
        <div className="space-y-2">
          {[
            { value: 100, label: "Bronze Tier", reached: currentValue >= 100 },
            { value: 250, label: "Silver Tier", reached: currentValue >= 250 },
            { value: 500, label: "Gold Tier", reached: currentValue >= 500 },
            { value: 750, label: "Platinum Tier", reached: currentValue >= 750 },
            { value: 1000, label: "Diamond Tier", reached: currentValue >= 1000 },
          ].map((milestone) => (
            <div
              key={milestone.value}
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                milestone.reached
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-sm font-medium">{milestone.label}</span>
              <span className="text-sm font-bold">${milestone.value}</span>
              {milestone.reached && <span className="text-lg">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-3xl p-4 border border-blue-200 dark:border-blue-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">💡 Pro Tips</h3>
        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
          <li>✓ Get 7+ hours of sleep consistently</li>
          <li>✓ Maintain a balanced diet</li>
          <li>✓ Exercise regularly (30+ min/day)</li>
          <li>✓ Stay hydrated with electrolytes</li>
          <li>✓ Manage stress levels</li>
        </ul>
      </div>
    </div>
  );
}
