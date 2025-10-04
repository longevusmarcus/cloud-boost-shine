import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, BarChart3, BookOpen, User, Droplet, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('profile_image_url, full_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setProfileImageUrl(profile.profile_image_url);
          setUserName(profile.full_name);
        }
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Track", path: "/tracking", icon: Calendar },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Insights", path: "/content", icon: BookOpen },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row transition-colors">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        
        body {
          overflow-x: hidden;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <div className="h-full p-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className={`rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                sidebarCollapsed ? 'w-8 h-8' : 'w-12 h-12'
              }`}>
                <Droplet className={`text-white dark:text-black transition-all duration-300 ${
                  sidebarCollapsed ? 'w-4 h-4' : 'w-6 h-6'
                }`} strokeWidth={2} fill="currentColor" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold text-black dark:text-white cursive-logo">Spermaxxing</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sperm Health Optimization</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isProfile = item.name === "Profile";
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'text-black dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  {isProfile && profileImageUrl ? (
                    <Avatar className="w-5 h-5 flex-shrink-0">
                      <AvatarImage src={profileImageUrl} alt={userName || "Profile"} />
                      <AvatarFallback className="text-xs">
                        {userName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                  )}
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
            }`}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                HIPAA Compliant • Secure
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content with proper spacing */}
      <div className={`pb-20 md:pb-0 transition-all duration-300 overflow-x-hidden ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
      }`}>
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 md:pt-6">
          {/* Conditional Back button for Profile page - Mobile only */}
          {location.pathname === "/profile" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="md:hidden flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-4"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              Back
            </button>
          )}
          {children}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex justify-around items-center px-2 py-2">
            {navItems.filter(item => item.name !== "Profile").map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'text-black dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Theme Toggle in Mobile Nav */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 text-gray-400 dark:text-gray-500"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Sun className="w-5 h-5" strokeWidth={2} />
              )}
              <span className="text-[10px] font-medium">Theme</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
