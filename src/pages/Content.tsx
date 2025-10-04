import { useState, useEffect } from "react";
import { Clock, UserCircle, Moon, Sun, Apple, Heart, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import InsightCard from "@/components/dashboard/InsightCard";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export default function Content() {
  const [activeTab, setActiveTab] = useState("foryou");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('profile_image_url')
        .eq('user_id', session.user.id)
        .single();
      setProfileImageUrl(profile?.profile_image_url || null);
    };
    fetchProfile();
  }, []);

  // Mock articles data
  const articles = [
    {
      id: 1,
      title: "Boost Your Sperm Count Naturally",
      category: "nutrition",
      content: "Learn about foods and supplements that can help improve sperm concentration...",
      read_time: 5,
      image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
    },
    {
      id: 2,
      title: "The Science of Sperm Motility",
      category: "science",
      content: "Understanding how sperm movement affects fertility and what you can do to improve it...",
      read_time: 7,
      image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"
    },
    {
      id: 3,
      title: "Exercise and Male Fertility",
      category: "lifestyle",
      content: "Discover the optimal exercise routine for boosting testosterone and sperm health...",
      read_time: 6,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
    },
    {
      id: 4,
      title: "Best Supplements for Sperm Health",
      category: "supplements",
      content: "A comprehensive guide to vitamins and minerals that support male fertility...",
      read_time: 8,
      image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
    },
    {
      id: 5,
      title: "Sleep Quality and Fertility",
      category: "lifestyle",
      content: "How sleep affects testosterone production and sperm quality...",
      read_time: 5,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
    },
    {
      id: 6,
      title: "Success Story: From Low Count to Father",
      category: "success_stories",
      content: "One man's journey to improving his sperm health through lifestyle changes...",
      read_time: 10,
      image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
    }
  ];

  const categoryColors: Record<string, string> = {
    nutrition: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    lifestyle: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    supplements: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    science: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    tips: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    success_stories: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
  };


  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden pb-1">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-base">🔔</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            💡 Insights & Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Expert tips and science-backed advice to maximize your results
          </p>
        </div>

        {/* Insight Cards Section */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Health Insights
          </h2>
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

        {/* Tabs - TikTok Style */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setActiveTab("foryou")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "foryou"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              For You
              {activeTab === "foryou" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`relative py-2.5 font-medium transition-all duration-200 text-sm ${
                activeTab === "all"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              All Articles
              {activeTab === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-24 md:pb-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-32 md:h-48 object-cover"
              />
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium capitalize ${
                    categoryColors[article.category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}>
                    {article.category.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-[10px] md:text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{article.read_time} min</span>
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {article.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
