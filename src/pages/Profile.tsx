import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Award, TrendingUp, Flame, Calendar, Target, Zap, Trophy, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import SubscriptionSection from "@/components/profile/SubscriptionSection";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Delete old image if exists
      if (profile?.profile_image_url) {
        const oldPath = profile.profile_image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${session.user.id}/${oldPath}`]);
        }
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, profile_image_url: publicUrl });

      toast({
        title: "Success!",
        description: "Profile image updated",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
    { id: "level_5", name: "Level 5", earned: (profile?.sperm_level || 1) >= 5, icon: Zap },
    { id: "level_10", name: "Level 10", earned: (profile?.sperm_level || 1) >= 10, icon: Trophy },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-3 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative group">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gray-900 flex items-center justify-center shadow-lg">
                    <UserCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                )}
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 mt-4">{user?.user_metadata?.full_name || user?.email}</h1>
              <p className="text-sm md:text-base text-gray-600">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs md:text-sm font-medium">
                  Age {profile?.age || 'N/A'}
                </span>
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
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Achievements</h2>
              <span className="text-xs text-gray-500">{badges.filter(b => b.earned).length}/{badges.length}</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {badges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                      badge.earned 
                        ? 'bg-gray-900' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 md:w-7 md:h-7 ${
                        badge.earned ? 'text-white' : 'text-gray-400'
                      }`} strokeWidth={2} />
                    </div>
                    <div className={`text-[10px] md:text-xs text-center font-medium max-w-[60px] leading-tight ${
                      badge.earned ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {badge.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscription Section */}
          <SubscriptionSection />

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 md:h-14 border-2 border-gray-300 text-gray-900 hover:bg-red-50 hover:border-red-500 hover:text-red-600 rounded-2xl font-semibold text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
}
