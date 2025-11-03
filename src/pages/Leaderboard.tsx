import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
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
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600/70" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 dark:border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top performers by value</p>
        </div>

        {/* Current User Rank - Minimal Badge */}
        {currentUserRank && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
              <span className="text-xs text-muted-foreground">Your position</span>
              <span className="text-sm font-semibold text-foreground">#{currentUserRank}</span>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={`group relative transition-all duration-200 ${
                entry.rank === currentUserRank
                  ? 'bg-accent/50'
                  : 'hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-4 px-4 py-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank) || (
                    <span className={`text-sm font-medium ${
                      entry.rank === currentUserRank 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted overflow-hidden ring-1 ring-border">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    entry.rank === currentUserRank 
                      ? 'text-foreground' 
                      : 'text-foreground'
                  }`}>
                    {entry.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>Lvl {entry.level}</span>
                    <span className="opacity-50">·</span>
                    <span>{entry.streak}d</span>
                  </div>
                </div>

                {/* Value */}
                <div className="flex-shrink-0 text-right">
                  <p className={`text-sm font-semibold tabular-nums ${
                    entry.rank === currentUserRank 
                      ? 'text-foreground' 
                      : 'text-foreground'
                  }`}>
                    ${entry.value.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Subtle separator */}
              {index < leaderboard.length - 1 && (
                <div className="absolute bottom-0 left-16 right-4 h-px bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
