import { useNavigate } from 'react-router-dom';
import { 
  FileText, AlertCircle, Calendar, MessageSquare, MessageCircle,
  MapPin, Building2, Heart, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

const services = [
  { icon: FileText, label: "Request Service", color: "text-primary", bgColor: "bg-secondary", path: "/request-service", requiresAuth: true },
  { icon: Calendar, label: "Events", color: "text-success", bgColor: "bg-success/10", path: "/updates", requiresAuth: false },
  { icon: MessageSquare, label: "Feedback", color: "text-warning", bgColor: "bg-warning/10", path: "/feedback", requiresAuth: true },
  { icon: MapPin, label: "Directory", color: "text-primary", bgColor: "bg-primary/10", path: "/services", requiresAuth: false },
  { icon: Building2, label: "Offices", color: "text-muted-foreground", bgColor: "bg-muted", path: "/services", requiresAuth: false },
  { icon: Heart, label: "Programs", color: "text-emergency", bgColor: "bg-emergency/10", path: "/services", requiresAuth: false },
  { icon: Compass, label: "Tourism", color: "text-accent", bgColor: "bg-accent/10", path: "/tourist-spots", requiresAuth: false },
];

export const QuickServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.requiresAuth && !user) {
      toast.error('You must be logged in to perform this action.', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }
    navigate(service.path);
  };

  return (
    <section className="px-4 lg:px-8">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-2xl font-semibold">Quick Services</h2>
        <button className="text-sm lg:text-base text-primary font-medium hover:text-primary/80 transition-colors" onClick={() => navigate('/services')}>See All</button>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <button key={service.label} onClick={() => handleServiceClick(service)} className="flex flex-col items-center gap-2 group animate-slide-up desktop-service-btn" style={{ animationDelay: `${index * 50}ms` }}>
              <div className={cn("w-full aspect-square max-w-[72px] lg:max-w-[88px] rounded-2xl flex items-center justify-center transition-all duration-300 shadow-soft", service.bgColor, "group-hover:lg:scale-110 group-hover:lg:shadow-md group-active:scale-95")}>
                <Icon className={cn("h-6 w-6 lg:h-7 lg:w-7 transition-transform duration-300", service.color)} />
              </div>
              <span className="text-[11px] lg:text-xs font-medium text-foreground text-center leading-tight">{service.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
