import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, TrendingUp, Heart, Dumbbell } from "lucide-react";
import Layout from "@/components/Layout";

export default function Content() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Insights & Resources</h1>
        </div>

        <div className="grid gap-4">
          {articles.map((article, idx) => (
            <div key={idx} className="bg-card rounded-3xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{article.title}</h3>
                  <p className="text-muted-foreground">{article.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">More Content Coming Soon</h2>
          <p className="text-muted-foreground">
            We're building a comprehensive library of evidence-based resources for optimization
          </p>
        </div>
      </div>
    </Layout>
  );
}
