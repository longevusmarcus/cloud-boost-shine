import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  rank: number;
  name: string;
  value: number;
  level: number;
  streak: number;
  avatar?: string;
}

export default function Leaderboard() {
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
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 dark:border-white border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Top performers by sperm value</p>
          {currentUserRank && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">Your rank: <span className="font-bold text-gray-900 dark:text-white">#{currentUserRank}</span></p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-2xl border-2 transition-all ${
                entry.rank === currentUserRank
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 text-center">
                  {getRankIcon(entry.rank) || (
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{entry.rank}</span>
                  )}
                </div>

                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{entry.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.streak} day streak</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">${entry.value.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>value</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
