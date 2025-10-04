import { useState } from "react";
import { BookOpen, Sparkles, Clock, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

export default function Content() {
  const [activeTab, setActiveTab] = useState("foryou");
  const navigate = useNavigate();

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
    nutrition: "bg-green-100 text-green-800",
    lifestyle: "bg-blue-100 text-blue-800",
    supplements: "bg-purple-100 text-purple-800",
    science: "bg-indigo-100 text-indigo-800",
    tips: "bg-yellow-100 text-yellow-800",
    success_stories: "bg-pink-100 text-pink-800"
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden pb-1">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <UserCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-base">🔔</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            💡 Insights & Learning
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Expert tips and science-backed advice to maximize your results
          </p>
        </div>

        {/* Tabs - Pill Style */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
              activeTab === "foryou"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
              activeTab === "all"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            All Articles
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-24 md:pb-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-32 md:h-48 object-cover"
              />
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium capitalize ${
                    categoryColors[article.category] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 text-[10px] md:text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{article.read_time} min</span>
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
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
