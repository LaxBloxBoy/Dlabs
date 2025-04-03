import { useState, useEffect, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  BookOpen,
  CreditCard,
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Get initials from username
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Check if mobile on mount and add resize listener
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/profile", value: "dashboard" },
    { icon: BookOpen, label: "Courses", path: "/profile/courses", value: "courses" },
    { icon: CreditCard, label: "Billing", path: "/profile/billing", value: "billing" },
    { icon: Bell, label: "Notifications", path: "/profile/notifications", value: "notifications" },
    { icon: Settings, label: "Settings", path: "/profile/settings", value: "settings" },
  ];

  const getActiveValue = () => {
    if (location === "/profile") return "dashboard";
    const path = location.split("/").pop();
    return path || "dashboard";
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-full bg-white shadow-md dark:bg-slate-800"
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:sticky top-0 bottom-0 left-0 z-40 w-64 transition-transform duration-300 flex-shrink-0 border-r bg-white dark:bg-slate-800 dark:border-slate-700 h-screen",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* User profile header */}
          <div className="p-4 border-b dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src="" alt={user?.username || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.username) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.username}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.value}>
                  <Link href={item.path}>
                    <a 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        getActiveValue() === item.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                      onClick={() => {
                        if (isMobile) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-6">
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;