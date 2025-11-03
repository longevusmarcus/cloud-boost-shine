import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, BarChart3, BookOpen, User, Droplet, ChevronLeft, ChevronRight, Moon, Sun, Trophy, DollarSign, ArrowLeft, TrendingUp, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import NotificationCenter from "@/components/NotificationCenter";

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
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Pricing", path: "/pricing", icon: DollarSign },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  // Pages that should show back button instead of floating buttons
  const pagesWithBackButton = ['/leaderboard', '/pricing'];
  const shouldShowBackButton = pagesWithBackButton.includes(location.pathname);
  
  // Hide floating buttons when on tracking page
  const isOnTrackingPage = location.pathname === '/tracking';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        
        body {
          overflow-x: hidden;
        }
      `}</style>

      {/* Desktop Floating Action Buttons */}
      <div className={`hidden md:flex fixed top-4 right-4 z-50 gap-2 transition-all duration-300 ${
        isOnTrackingPage ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
      }`}>
        <Link
          to="/leaderboard"
          className="w-11 h-11 rounded-full bg-background border-2 border-border shadow-lg flex items-center justify-center hover:bg-accent transition-all hover:scale-105"
          title="Leaderboard"
        >
          <Trophy className="w-5 h-5" />
        </Link>
        <Link
          to="/pricing"
          className="w-11 h-11 rounded-full bg-background border-2 border-border shadow-lg flex items-center justify-center hover:bg-accent transition-all hover:scale-105"
          title="Pricing"
        >
          <DollarSign className="w-5 h-5" />
        </Link>
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full bg-background border-2 border-border shadow-lg flex items-center justify-center hover:bg-accent transition-all hover:scale-105"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Header Buttons */}
      {shouldShowBackButton ? (
        /* Back button for profile, leaderboard, and pricing pages */
        <div className={`fixed top-4 left-4 z-50 md:hidden transition-all duration-300 ${
          isOnTrackingPage ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Full header buttons for other pages */
        <div className={`fixed top-4 left-4 right-4 z-50 md:hidden flex items-center justify-between transition-all duration-300 ${
          isOnTrackingPage ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
        }`}>
          {/* Left side: Notifications and Theme toggle */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Right side: Leaderboard and Pricing */}
          <div className="flex items-center gap-2">
            <Link
              to="/leaderboard"
              className="w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center transition-colors"
              title="Leaderboard"
            >
              <Trophy className="w-4 h-4" />
            </Link>
            
            <Link
              to="/pricing"
              className="w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center transition-colors"
              title="Pricing"
            >
              <DollarSign className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 ${
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
        <div className="w-full max-w-4xl mx-auto px-2 pt-2 md:pt-4">
          {children}
        </div>
      </div>

      {/* Mobile Navigation - Glassmorphic */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-3">
        <div className="relative">
          {/* Glass container */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-lg border border-gray-200/30 dark:border-gray-700/30 px-4 py-3">
            <div className="flex justify-around items-center relative">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Home className="w-5 h-5" strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
                <span className="text-[9px] font-medium">Home</span>
              </Link>

              {/* Analytics */}
              <Link
                to="/analytics"
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                  isActive('/analytics')
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <TrendingUp className="w-5 h-5" strokeWidth={isActive('/analytics') ? 2.5 : 2} />
                <span className="text-[9px] font-medium">Stats</span>
              </Link>

              {/* Center Floating Button - Spacer */}
              <div className="w-12"></div>

              {/* Content */}
              <Link
                to="/content"
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                  isActive('/content')
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <BookOpen className="w-5 h-5" strokeWidth={isActive('/content') ? 2.5 : 2} />
                <span className="text-[9px] font-medium">Learn</span>
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                  isActive('/profile')
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <User className="w-5 h-5" strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className="text-[9px] font-medium">Profile</span>
              </Link>
            </div>
          </div>

          {/* Floating Center Button */}
          <Link
            to={isOnTrackingPage ? "/dashboard" : "/tracking"}
            className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 bg-gray-900 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className={`transition-all duration-300 ${isOnTrackingPage ? 'rotate-90' : 'rotate-0'}`}>
              {isOnTrackingPage ? (
                <X className="w-7 h-7 text-white" strokeWidth={2.5} />
              ) : (
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              )}
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
