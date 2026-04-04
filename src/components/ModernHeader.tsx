import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const ModernHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Updates", path: "/updates" },
    { label: "Community", path: "/community" },
    { label: "Directory", path: "/directory" },
  ];

  // Hide header on certain routes
  const hideHeaderRoutes = ["/auth"];
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop Header Only */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Branding */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-muted-foreground">Municipality of</p>
                <p className="text-lg font-bold text-foreground">myCortes</p>
              </div>
            </button>

            {/* Nav Items */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                      isActive
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted relative"
                onClick={() => navigate("/updates")}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(user ? "/profile" : "/auth")}
              >
                <User className="h-4 w-4" />
                {user ? "Profile" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header - only on desktop */}
      <div className="hidden lg:block h-16" />
    </>
  );
};
