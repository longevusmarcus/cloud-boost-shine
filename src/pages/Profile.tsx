import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Award, TrendingUp, Flame, Calendar, Target, Zap, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const badges = [
    { id: "first_log", name: "First Log", earned: true, icon: Target },
    { id: "week_streak", name: "7 Day Streak", earned: (profile?.longest_streak || 0) >= 7, icon: Flame },
    { id: "month_streak", name: "30 Day Streak", earned: (profile?.longest_streak || 0) >= 30, icon: Award },
    { id: "level_5", name: "Level 5", earned: (profile?.sperm_level || 0) >= 5, icon: Zap },
    { id: "level_10", name: "Level 10", earned: (profile?.sperm_level || 0) >= 10, icon: Trophy },
  ];

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gray-900 flex items-center justify-center mb-4 shadow-lg">
              <UserCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{profile?.full_name || 'User'}</h1>
            <p className="text-sm md:text-base text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3">
              {profile?.age && (
                <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs md:text-sm font-medium">
                  Age {profile.age}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs md:text-sm font-medium">
                Level {profile?.sperm_level || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 md:gap-1 mb-1">
              <span className="text-sm md:text-lg font-bold text-gray-900">$</span>
              <span className="text-xl md:text-3xl font-bold text-gray-900">{(profile?.sperm_value || 50).toLocaleString()}</span>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Sperm Value</div>
          </div>

          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{profile?.current_streak || 0}</div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Streak</div>
          </div>

          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{profile?.longest_streak || 0}</div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Best</div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                    badge.earned
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                  <span className="text-[10px] md:text-xs font-medium text-center">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </Layout>
  );
}
