import { useNavigate } from 'react-router-dom';
import { 
  FileText, AlertCircle, Calendar, MessageSquare, MessageCircle,
  MapPin, Building2, Heart, Compass, Smartphone, Users, Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

// Color coding: Red (emergency), Green (health/community), Blue (services), Purple (tourism), Orange (events)
const services = [
  { 
    icon: FileText, 
    label: "Request Service", 
    color: "text-white", 
    bgColor: "bg-blue-500 hover:bg-blue-600", 
    category: "services",
    path: "/request-service", 
    requiresAuth: true 
  },
  { 
    icon: Calendar, 
    label: "Events", 
    color: "text-white", 
    bgColor: "bg-orange-500 hover:bg-orange-600", 
    category: "events",
    path: "/updates", 
    requiresAuth: false 
  },
  { 
    icon: MessageSquare, 
    label: "Feedback", 
    color: "text-white", 
    bgColor: "bg-purple-500 hover:bg-purple-600", 
    category: "services",
    path: "/feedback", 
    requiresAuth: true 
  },
  { 
    icon: MapPin, 
    label: "Directory", 
    color: "text-white", 
    bgColor: "bg-blue-500 hover:bg-blue-600", 
    category: "services",
    path: "/directory", 
    requiresAuth: false 
  },
  { 
    icon: Building2, 
    label: "Offices", 
    color: "text-white", 
    bgColor: "bg-blue-600 hover:bg-blue-700", 
    category: "services",
    path: "/directory/offices", 
    requiresAuth: false 
  },
  { 
    icon: Heart, 
    label: "Programs", 
    color: "text-white", 
    bgColor: "bg-green-500 hover:bg-green-600", 
    category: "community",
    path: "/directory/programs", 
    requiresAuth: false 
  },
  { 
    icon: AlertCircle, 
    label: "Emergency", 
    color: "text-white", 
    bgColor: "bg-red-500 hover:bg-red-600", 
    category: "emergency",
    path: "/emergency", 
    requiresAuth: false 
  },
  { 
    icon: Compass, 
    label: "Tourism", 
    color: "text-white", 
    bgColor: "bg-amber-500 hover:bg-amber-600", 
    category: "tourism",
    path: "/tourist-spots", 
    requiresAuth: false 
  },
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
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">Quick Services</h2>
          <p className="text-sm text-muted-foreground mt-1">Access common municipal services</p>
        </div>
        <button 
          className="text-sm lg:text-base text-primary font-medium hover:text-primary/80 transition-colors duration-200 font-semibold" 
          onClick={() => navigate('/services')}
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <button 
              key={service.label} 
              onClick={() => handleServiceClick(service)} 
              className="flex flex-col items-center gap-2.5 group"
              style={{ animation: `slideUp 0.4s ease-out ${index * 50}ms backwards` }}
            >
              <div className={cn(
                "w-full aspect-square max-w-[72px] lg:max-w-[88px] rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-300 shadow-md lg:shadow-lg",
                service.bgColor,
                "group-hover:shadow-lg lg:group-hover:shadow-xl group-hover:scale-105 group-active:scale-95 transform"
              )}>
                <Icon className={cn("h-6 w-6 lg:h-8 lg:w-8 transition-transform duration-300", service.color)} />
              </div>
              <span className="text-[11px] lg:text-xs font-semibold text-foreground text-center leading-tight px-1">
                {service.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
