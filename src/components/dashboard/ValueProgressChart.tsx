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
      <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-4 border border-blue-200 dark:border-blue-900">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Value Reference</h4>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              $70,000 represents maximum value for healthy young individuals. 
              Actual maximum value varies by age, health status, and lifestyle factors.
            </p>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300">Current</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            ${(currentValue / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Balance
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 dark:from-purple-950 dark:via-purple-900 dark:to-violet-950 rounded-2xl p-4 border border-purple-200 dark:border-purple-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-700 dark:text-purple-300">Maximum</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            ${(maxValue / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Potential
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 dark:from-blue-950 dark:via-blue-900 dark:to-cyan-950 rounded-2xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-300">Progress</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {progress.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Complete
          </div>
        </div>
      </div>

      {/* Progress Bar - Financial Style */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Portfolio Growth</h3>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
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
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Portfolio Performance</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                +{((currentValue / 50 - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="rgb(20, 184, 166)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity={0.1} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
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
                      <div className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
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
                stroke="rgb(16, 185, 129)"
                strokeWidth={3}
                dot={{
                  fill: 'rgb(16, 185, 129)',
                  r: 5,
                  strokeWidth: 3,
                  stroke: 'rgb(255, 255, 255)',
                  filter: 'url(#glow)'
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 4,
                  stroke: 'rgb(255, 255, 255)',
                  fill: 'rgb(16, 185, 129)',
                  className: 'cursor-pointer',
                  filter: 'url(#glow)'
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Achievement Milestones */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Achievement Tiers</h3>
        </div>
        <div className="space-y-3">
          {[
            { value: 5000, label: "Bronze Tier", icon: Medal, color: "amber", reached: currentValue >= 5000 },
            { value: 15000, label: "Silver Tier", icon: Award, color: "gray", reached: currentValue >= 15000 },
            { value: 30000, label: "Gold Tier", icon: Crown, color: "yellow", reached: currentValue >= 30000 },
            { value: 50000, label: "Platinum Tier", icon: Gem, color: "cyan", reached: currentValue >= 50000 },
            { value: 70000, label: "Diamond Tier", icon: Zap, color: "purple", reached: currentValue >= 70000 },
          ].map((milestone) => {
            const Icon = milestone.icon;
            return (
              <div
                key={milestone.value}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  milestone.reached
                    ? 'bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-100 shadow-lg scale-[1.02]'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    milestone.reached 
                      ? 'bg-white/20 dark:bg-black/20' 
                      : `bg-${milestone.color}-100 dark:bg-${milestone.color}-900`
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      milestone.reached
                        ? 'text-white dark:text-black'
                        : `text-${milestone.color}-600 dark:text-${milestone.color}-400`
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
                    <span className="text-2xl">✓</span>
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
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-900 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Optimization Strategies</h3>
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
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-emerald-100 dark:border-emerald-900">
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
