import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, ComposedChart } from "recharts";
import { format } from "date-fns";
import { TrendingUp, Target, Percent, Award, Crown, Gem, Zap, Medal, Trophy, Info } from "lucide-react";

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

  const maxValue = 70000;
  const progress = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Disclaimer Note */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Value Reference</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              $70,000 represents maximum value for healthy young individuals. 
              Actual maximum value varies by age, health status, and lifestyle factors.
            </p>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Current</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ${(currentValue / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Balance
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Maximum</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ${(maxValue / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Potential
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Progress</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {progress.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Complete
          </div>
        </div>
      </div>

      {/* Progress Bar - Financial Style */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Portfolio Growth</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ${(currentValue / 1000).toFixed(1)}K / ${(maxValue / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
        <div className="relative h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 dark:from-emerald-500 dark:via-teal-400 dark:to-cyan-500 rounded-full transition-all duration-700 shadow-lg"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/20 to-transparent rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-3">
          <span className="font-medium">$0</span>
          <span>$17.5K</span>
          <span>$35K</span>
          <span>$52.5K</span>
          <span className="font-medium">$70K</span>
        </div>
      </div>

      {/* Financial Portfolio Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">Portfolio Performance</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                +{((currentValue / 50 - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="rgb(75, 85, 99)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(156, 163, 175, 0.15)" 
                vertical={false}
              />
              
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                stroke="rgb(156, 163, 175)"
                style={{ fontSize: '11px', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis
                stroke="rgb(156, 163, 175)"
                style={{ fontSize: '11px', fontWeight: 500 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-100" />
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {format(new Date(data.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          ${(data.value / 1000).toFixed(1)}K
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                            <p className="text-gray-600 dark:text-gray-400">Masturbation</p>
                            <p className="font-bold text-gray-900 dark:text-white">{data.masturbation}x</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                            <p className="text-gray-600 dark:text-gray-400">Sleep</p>
                            <p className="font-bold text-gray-900 dark:text-white">{data.sleep}h</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 col-span-2">
                            <p className="text-gray-600 dark:text-gray-400">Diet</p>
                            <p className="font-bold text-gray-900 dark:text-white capitalize">{data.diet}</p>
                          </div>
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
                stroke="url(#portfolioGradient)"
                strokeWidth={0}
                fill="url(#portfolioGradient)"
              />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="rgb(31, 41, 55)"
                strokeWidth={2}
                dot={{
                  fill: 'rgb(31, 41, 55)',
                  r: 4,
                  strokeWidth: 2,
                  stroke: 'rgb(255, 255, 255)'
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 3,
                  stroke: 'rgb(255, 255, 255)',
                  fill: 'rgb(31, 41, 55)',
                  className: 'cursor-pointer'
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Achievement Milestones */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">Achievement Tiers</h3>
        </div>
        <div className="space-y-3">
          {[
            { value: 5000, label: "Bronze Tier", icon: Medal, reached: currentValue >= 5000 },
            { value: 15000, label: "Silver Tier", icon: Award, reached: currentValue >= 15000 },
            { value: 30000, label: "Gold Tier", icon: Crown, reached: currentValue >= 30000 },
            { value: 50000, label: "Platinum Tier", icon: Gem, reached: currentValue >= 50000 },
            { value: 70000, label: "Diamond Tier", icon: Zap, reached: currentValue >= 70000 },
          ].map((milestone) => {
            const Icon = milestone.icon;
            return (
              <div
                key={milestone.value}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  milestone.reached
                    ? 'bg-gray-900 dark:bg-gray-100 border border-gray-900 dark:border-gray-100'
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    milestone.reached 
                      ? 'bg-white/20 dark:bg-black/20' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      milestone.reached
                        ? 'text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      milestone.reached
                        ? 'text-white dark:text-black'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {milestone.label}
                    </p>
                    <p className={`text-xs ${
                      milestone.reached
                        ? 'text-white/70 dark:text-black/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      ${(milestone.value / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                {milestone.reached && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-white dark:text-black">✓</span>
                  </div>
                )}
                {!milestone.reached && currentValue > 0 && (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    ${((milestone.value - currentValue) / 1000).toFixed(1)}K to go
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">Optimization Strategies</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "😴", label: "Quality Sleep", desc: "7-9 hours nightly" },
            { icon: "🥗", label: "Balanced Diet", desc: "Nutrient-rich foods" },
            { icon: "💪", label: "Regular Exercise", desc: "30+ min daily" },
            { icon: "⚡", label: "Electrolytes", desc: "Stay hydrated" },
            { icon: "🧘", label: "Stress Management", desc: "Keep levels low" },
            { icon: "🚫", label: "Moderation", desc: "Limit frequency" },
          ].map((tip, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-2">{tip.icon}</div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{tip.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
