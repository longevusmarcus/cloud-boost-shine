import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, UserCircle, TrendingUp, Heart, Dumbbell } from "lucide-react";
import Layout from "@/components/Layout";

export default function Content() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("foryou");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const articles = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Testosterone Optimization",
      description: "Learn about natural ways to boost testosterone levels through diet, exercise, and lifestyle changes.",
      category: "Hormones"
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Exercise & Recovery",
      description: "Optimal training protocols and recovery strategies for reproductive health.",
      category: "Fitness"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Supplement Guide",
      description: "Evidence-based supplements that support male reproductive health and hormone optimization.",
      category: "Nutrition"
    }
  ];

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between md:hidden pb-2">
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

        <div className="hidden md:block">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Insights</h1>
          <p className="text-sm md:text-base text-gray-600">Optimize your reproductive health</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "foryou"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "discover"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "saved"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Articles */}
        <div className="grid gap-4">
          {articles.map((article, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600">{article.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center">
          <BookOpen className="w-16 h-16 text-gray-900 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">More Content Coming Soon</h2>
          <p className="text-gray-600">
            We're building a comprehensive library of evidence-based resources for optimization
          </p>
        </div>
      </div>
    </Layout>
  );
}
