import { useState, useEffect } from "react";
import { UserCircle, Moon, Sun, Apple, Heart, Droplet, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import InsightCard from "@/components/dashboard/InsightCard";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const articles = [
  {
    id: 1,
    title: "The Science of Sleep and Sperm Health",
    category: "Sleep",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
  },
  {
    id: 2,
    title: "Nutrition Tips for Optimal Fertility",
    category: "Nutrition",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
  },
  {
    id: 3,
    title: "Exercise and Male Reproductive Health",
    category: "Exercise",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  },
];

export default function Content() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("for-you");

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
            💡 Health Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Expert guidance on nutrition, sleep, exercise, and lifestyle for optimal fertility
          </p>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
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

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pb-24 md:pb-6">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0 flex gap-4">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <span className="text-xs font-medium text-primary">{article.category}</span>
                    <h3 className="font-semibold mt-1 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0 flex gap-4">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <span className="text-xs font-medium text-primary">{article.category}</span>
                    <h3 className="font-semibold mt-1 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
