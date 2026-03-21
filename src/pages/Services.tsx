import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  FileText, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  MapPin, 
  Building2,
  Heart,
  Wallet,
  ArrowLeft,
  ChevronRight,
  Image
} from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  { 
    icon: FileText, 
    label: "Request Document/Service", 
    description: "Request certificates, permits, IDs online",
    color: "text-primary", 
    bgColor: "bg-secondary",
    path: "/request-service",
    requiresAuth: true
  },
  { 
    icon: AlertCircle, 
    label: "Report an Issue", 
    description: "Report community problems (no login needed)",
    color: "text-accent", 
    bgColor: "bg-accent/10",
    path: "/report-issue",
    requiresAuth: false
  },
  { 
    icon: Heart, 
    label: "Community Feed", 
    description: "View reports and support community issues",
    color: "text-destructive", 
    bgColor: "bg-destructive/10",
    path: "/community",
    requiresAuth: false
  },
  { 
    icon: MessageSquare, 
    label: "Feedback", 
    description: "Share your feedback and suggestions",
    color: "text-warning", 
    bgColor: "bg-warning/10",
    path: "/feedback",
    requiresAuth: true
  },
  { 
    icon: MapPin, 
    label: "Tourist Spots", 
    description: "Explore Surigao del Sur destinations",
    color: "text-success", 
    bgColor: "bg-success/10",
    path: "/tourist-spots",
    requiresAuth: false
  },
  { 
    icon: Building2, 
    label: "Municipal Directory", 
    description: "Offices, Programs, and Emergency contacts",
    color: "text-primary", 
    bgColor: "bg-primary/10",
    path: "/directory",
    requiresAuth: false
  },
  { 
    icon: AlertCircle, 
    label: "Emergency Assistance", 
    description: "Call emergency services with one tap",
    color: "text-emergency", 
    bgColor: "bg-emergency/10",
    path: "/emergency",
    requiresAuth: false
  },
  { 
    icon: Image, 
    label: "Government Wall", 
    description: "Latest government announcements and updates",
    color: "text-accent", 
    bgColor: "bg-accent/10",
    path: "/government-wall",
    requiresAuth: false
  },
];

const Services = () => {
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
    <div className="min-h-screen bg-background pb-24 lg:pb-8 lg:pt-14">
      <div className="app-container">
        {/* Header */}
        <div className="px-4 pt-12 lg:pt-8 pb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Access all municipal services</p>
        </div>

        {/* Services List - grid on desktop */}
        <div className="px-4 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.label} 
                variant="elevated"
                className="cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleServiceClick(service)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", service.bgColor)}>
                      <Icon className={cn("h-6 w-6", service.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{service.label}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav currentPath="/services" onNavigate={(path) => navigate(path)} />
    </div>
  );
};

export default Services;
