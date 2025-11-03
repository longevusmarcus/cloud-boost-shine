import { useState, useEffect } from "react";
import { UserCircle, Moon, Sun, Apple, Heart, Droplet, Activity, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import InsightCard from "@/components/dashboard/InsightCard";
import FloatingChatbot from "@/components/dashboard/FloatingChatbot";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

type ContentCard = {
  title: string;
  subtitle: string;
  overview: string;
  category: string;
  imageUrl?: string;
};

export default function Content() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("for-you");
  const [personalizedContent, setPersonalizedContent] = useState<ContentCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      if (profileData) {
        setProfile(profileData);
        setProfileImageUrl(profileData.profile_image_url || null);
        generatePersonalizedContent(profileData);
      }
    };
    fetchProfile();
  }, []);

  const generatePersonalizedContent = async (profileData: any) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-personalized-content', {
        body: { profile: profileData }
      });

      if (error) throw error;

      if (data?.cards) {
        setPersonalizedContent(data.cards);
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: "Content Generation Error",
        description: error.message || "Failed to generate personalized content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return Apple;
      case 'sleep': return Moon;
      case 'exercise': return Heart;
      case 'hydration': return Droplet;
      case 'stress': return Activity;
      default: return Sparkles;
    }
  };

  const getCategoryImage = (category: string, imageUrl?: string) => {
    // Use AI-generated image if available, otherwise fall back to category-based images
    if (imageUrl) return imageUrl;
    
    switch (category) {
      case 'nutrition': return "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80";
      case 'sleep': return "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80";
      case 'exercise': return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80";
      case 'hydration': return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80";
      case 'stress': return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80";
      case 'supplements': return "https://images.unsplash.com/photo-1550572017-4814c3b925b8?w=800&q=80";
      case 'lifestyle': return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80";
      default: return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80";
    }
  };


  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 mt-16 md:mt-0">
        {/* Tabs Section - TikTok Style */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setActiveTab("for-you")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "for-you"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              For You
              {activeTab === "for-you" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "discover"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Discover
              {activeTab === "discover" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "for-you" && (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            ) : personalizedContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {personalizedContent.map((card, index) => (
                  <InsightCard
                    key={index}
                    title={card.title}
                  subtitle={card.subtitle}
                  overview={card.overview}
                  icon={getCategoryIcon(card.category)}
                  backgroundImage={getCategoryImage(card.category, card.imageUrl)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InsightCard
                  title="Nutrition Matters"
                  subtitle="Diet Quality Impact on Fertility"
                  overview="Discover how nutrient-rich foods and balanced eating patterns directly influence sperm health. Learn which vitamins and minerals are essential for optimal reproductive function."
                  icon={Apple}
                  backgroundImage="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80"
                />
                
                <InsightCard
                  title="Sleep & Recovery"
                  subtitle="The Power of Quality Rest"
                  overview="Quality sleep is crucial for hormone regulation and sperm production. Explore how proper rest patterns can enhance your fertility journey and overall well-being."
                  icon={Moon}
                  backgroundImage="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80"
                />
                
                <InsightCard
                  title="Active Lifestyle"
                  subtitle="Exercise for Optimal Health"
                  overview="Regular physical activity improves circulation, hormone balance, and stress management. Find the perfect exercise routine that supports your reproductive health goals."
                  icon={Heart}
                  backgroundImage="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                />
                
                <InsightCard
                  title="Hydration Essentials"
                  subtitle="Water and Reproductive Health"
                  overview="Proper hydration supports all bodily functions, including sperm production and quality. Learn optimal hydration strategies for peak fertility health."
                  icon={Droplet}
                  backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "discover" && (
          <div className="space-y-6">
            {/* Insight Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <InsightCard
                title="Nutrition Matters"
                subtitle="Diet Quality Impact on Fertility"
                overview="Discover how nutrient-rich foods and balanced eating patterns directly influence sperm health. Learn which vitamins and minerals are essential for optimal reproductive function."
                icon={Apple}
                backgroundImage="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80"
              />
              
              <InsightCard
                title="Sleep & Recovery"
                subtitle="The Power of Quality Rest"
                overview="Quality sleep is crucial for hormone regulation and sperm production. Explore how proper rest patterns can enhance your fertility journey and overall well-being."
                icon={Moon}
                backgroundImage="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80"
              />
              
              <InsightCard
                title="Active Lifestyle"
                subtitle="Exercise for Optimal Health"
                overview="Regular physical activity improves circulation, hormone balance, and stress management. Find the perfect exercise routine that supports your reproductive health goals."
                icon={Heart}
                backgroundImage="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
              />
              
              <InsightCard
                title="Hydration Essentials"
                subtitle="Water and Reproductive Health"
                overview="Proper hydration supports all bodily functions, including sperm production and quality. Learn optimal hydration strategies for peak fertility health."
                icon={Droplet}
                backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot profile={profile} />
    </Layout>
  );
}
