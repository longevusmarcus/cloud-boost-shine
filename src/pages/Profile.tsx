import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, LogOut, Award, TrendingUp, Flame, Calendar, Target, Zap, Trophy, Camera, Moon, Sun, ArrowLeft, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import SubscriptionSection from "@/components/profile/SubscriptionSection";
import MFASettings from "@/components/profile/MFASettings";
import { useTheme } from "@/components/ThemeProvider";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingLifestyle, setIsEditingLifestyle] = useState(false);
  const [basicForm, setBasicForm] = useState({
    full_name: '',
    age: '',
    goal: '',
    height_feet: '',
    height_inches: '',
    weight: ''
  });
  const [lifestyleForm, setLifestyleForm] = useState({
    smoking: '',
    alcohol: '',
    exercise: '',
    diet_quality: '',
    sleep_hours: '',
    stress_level: '',
    masturbation_frequency: '',
    sexual_activity: '',
    supplements: '',
    career_status: '',
    family_pledge: '',
    tight_clothing: false,
    hot_baths: false
  });
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
      setBasicForm({
        full_name: profileData?.full_name || '',
        age: profileData?.age?.toString() || '',
        goal: profileData?.goal || '',
        height_feet: profileData?.height_feet?.toString() || '',
        height_inches: profileData?.height_inches?.toString() || '',
        weight: profileData?.weight?.toString() || ''
      });
      setLifestyleForm({
        smoking: profileData?.smoking || '',
        alcohol: profileData?.alcohol || '',
        exercise: profileData?.exercise || '',
        diet_quality: profileData?.diet_quality || '',
        sleep_hours: profileData?.sleep_hours?.toString() || '',
        stress_level: profileData?.stress_level || '',
        masturbation_frequency: profileData?.masturbation_frequency || '',
        sexual_activity: profileData?.sexual_activity || '',
        supplements: profileData?.supplements || '',
        career_status: profileData?.career_status || '',
        family_pledge: profileData?.family_pledge || '',
        tight_clothing: profileData?.tight_clothing || false,
        hot_baths: profileData?.hot_baths || false
      });
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

  const handleSaveBasic = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: basicForm.full_name,
          age: basicForm.age ? parseInt(basicForm.age) : null,
          goal: basicForm.goal,
          height_feet: basicForm.height_feet ? parseInt(basicForm.height_feet) : null,
          height_inches: basicForm.height_inches ? parseInt(basicForm.height_inches) : null,
          weight: basicForm.weight ? parseInt(basicForm.weight) : null,
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile updated",
      });

      setIsEditingBasic(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveLifestyle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_profiles')
        .update({
          smoking: lifestyleForm.smoking,
          alcohol: lifestyleForm.alcohol,
          exercise: lifestyleForm.exercise,
          diet_quality: lifestyleForm.diet_quality,
          sleep_hours: lifestyleForm.sleep_hours ? parseFloat(lifestyleForm.sleep_hours) : null,
          stress_level: lifestyleForm.stress_level,
          masturbation_frequency: lifestyleForm.masturbation_frequency,
          sexual_activity: lifestyleForm.sexual_activity,
          supplements: lifestyleForm.supplements,
          career_status: lifestyleForm.career_status,
          family_pledge: lifestyleForm.family_pledge,
          tight_clothing: lifestyleForm.tight_clothing,
          hot_baths: lifestyleForm.hot_baths,
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Lifestyle info updated",
      });

      setIsEditingLifestyle(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-3 md:p-8">
        {/* Floating Buttons - Mobile Only */}
        <div className="fixed top-4 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg">
              <span className="text-base">🔔</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 mt-16 md:mt-0">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-5 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative group">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gray-900 dark:bg-gray-950 flex items-center justify-center shadow-lg">
                    <UserCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                )}
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 text-white dark:text-black" />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 mt-4">{user?.user_metadata?.full_name || user?.email}</h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-xs md:text-sm font-medium">
                  Age {profile?.age || 'N/A'}
                </span>
                <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-xs md:text-sm font-medium">
                  Level {profile?.sperm_level || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-white" />
              </div>
              <div className="flex items-baseline justify-center gap-0.5 md:gap-1 mb-1">
                <span className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">$</span>
                <span className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">{(profile?.sperm_value || 50).toLocaleString()}</span>
              </div>
              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium">Sperm Value</div>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-white" />
              </div>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{profile?.current_streak || 0}</div>
              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium">Streak</div>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-white" />
              </div>
              <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{profile?.longest_streak || 0}</div>
              <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium">Best</div>
          </div>
        </div>

        {/* MFA Settings */}
          <MFASettings />

          {/* Subscription Section */}
          <SubscriptionSection />

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 md:h-14 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 rounded-2xl font-semibold text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
}
