import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LeaderboardEntry {
  rank: number;
  name: string;
  value: number;
  level: number;
  streak: number;
  avatar?: string;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, sperm_value, sperm_level, current_streak, profile_image_url')
        .order('sperm_value', { ascending: false })
        .limit(100);

      if (profiles) {
        const entries: LeaderboardEntry[] = profiles.map((profile, index) => ({
          rank: index + 1,
          name: profile.full_name || 'Anonymous',
          value: profile.sperm_value || 0,
          level: profile.sperm_level || 1,
          streak: profile.current_streak || 0,
          avatar: profile.profile_image_url || undefined,
        }));

        setLeaderboard(entries);

        if (session) {
          const userRank = entries.findIndex(e => profiles[entries.indexOf(e)].user_id === session.user.id) + 1;
          setCurrentUserRank(userRank || null);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600/70" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 dark:border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Back Button - Mobile Only */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight">Leaderboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Top performers by value</p>
        </div>

        {/* Current User Rank - Minimal Badge */}
        {currentUserRank && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-xs text-gray-600 dark:text-gray-400">Your position</span>
              <span className="text-sm font-semibold text-black dark:text-white">#{currentUserRank}</span>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={`group relative transition-all duration-200 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 ${
                entry.rank === currentUserRank
                  ? 'ring-2 ring-black dark:ring-white'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 px-4 py-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank) || (
                    <span className={`text-sm font-medium ${
                      entry.rank === currentUserRank 
                        ? 'text-black dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-black dark:text-white">
                    {entry.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    <span>Lvl {entry.level}</span>
                    <span className="opacity-50">·</span>
                    <span>{entry.streak}d</span>
                  </div>
                </div>

                {/* Value */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-black dark:text-white">
                    ${entry.value.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Subtle separator */}
              {index < leaderboard.length - 1 && (
                <div className="absolute bottom-0 left-16 right-4 h-px bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
