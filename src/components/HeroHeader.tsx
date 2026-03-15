import { useNavigate } from 'react-router-dom';
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-coastal.jpg";

export const HeroHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Cortes coastal view" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      <div className="relative z-10 px-4 pt-12 pb-8 lg:pt-8 lg:pb-16 lg:px-12 desktop-hero">
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden">
              <img src="/cortes.png" alt="myCortes logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/70 text-xs lg:text-sm font-medium">Municipality of</p>
              <h1 className="text-white text-lg lg:text-xl font-bold tracking-tight">Cortes</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-all duration-200">
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative transition-all duration-200" onClick={() => navigate('/updates')}>
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-all duration-200" onClick={() => navigate(user ? '/profile' : '/auth')}>
              <User className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>
        </div>

        <div className="mb-8 lg:mb-10 lg:max-w-2xl">
          <p className="text-white/80 text-sm lg:text-base mb-2 font-medium">Magandang hapon,</p>
          <h2 className="text-white text-2xl lg:text-5xl font-bold mb-3 lg:mb-4 leading-tight">Welcome to myCortes!</h2>
          <p className="text-white/70 text-sm lg:text-lg leading-relaxed max-w-lg">Your digital gateway to municipal services and community engagement</p>
        </div>

        <Button variant="accent" size="lg" className="w-full lg:w-auto lg:px-8 lg:py-3 lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200" onClick={() => navigate('/request-service')}>
          <span>Report an Issue</span>
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-6 bg-background rounded-t-3xl" />
    </header>
  );
};
