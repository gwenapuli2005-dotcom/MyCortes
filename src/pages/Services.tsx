import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
  Compass,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernFooter } from '@/components/ModernFooter';
import { BottomNav } from '@/components/BottomNav';


const services = [
  { 
    icon: FileText, 
    label: "Request Document/Service", 
    description: "Request certificates, permits, IDs online",
    color: "text-white", 
    bgColor: "bg-blue-500",
    category: "services",
    path: "/request-service",
    requiresAuth: true
  },
  { 
    icon: AlertCircle, 
    label: "Report an Issue", 
    description: "Report community problems easily",
    color: "text-white", 
    bgColor: "bg-red-500",
    category: "emergency",
    path: "/report-issue",
    requiresAuth: false
  },
  { 
    icon: Heart, 
    label: "Community Feed", 
    description: "View and support community issues",
    color: "text-white", 
    bgColor: "bg-green-500",
    category: "community",
    path: "/community",
    requiresAuth: false
  },
  { 
    icon: MessageSquare, 
    label: "Feedback", 
    description: "Share your feedback and suggestions",
    color: "text-white", 
    bgColor: "bg-purple-500",
    category: "services",
    path: "/feedback",
    requiresAuth: true
  },
  { 
    icon: Compass, 
    label: "Tourist Spots", 
    description: "Explore Surigao del Sur destinations",
    color: "text-white", 
    bgColor: "bg-amber-500",
    category: "tourism",
    path: "/tourist-spots",
    requiresAuth: false
  },
  { 
    icon: Building2, 
    label: "Municipal Directory", 
    description: "Offices, Programs, and Contacts",
    color: "text-white", 
    bgColor: "bg-blue-600",
    category: "services",
    path: "/directory",
    requiresAuth: false
  },
  { 
    icon: AlertCircle, 
    label: "Emergency Assistance", 
    description: "Call emergency services instantly",
    color: "text-white", 
    bgColor: "bg-red-600",
    category: "emergency",
    path: "/emergency",
    requiresAuth: false
  },
  { 
    icon: Calendar, 
    label: "Government Updates", 
    description: "Latest government announcements",
    color: "text-white", 
    bgColor: "bg-orange-500",
    category: "events",
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

  // Group services by category
  const categories = [
    { key: 'services', label: 'Document & Services', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { key: 'emergency', label: 'Emergency & Safety', icon: AlertCircle, color: 'from-red-500 to-red-600' },
    { key: 'community', label: 'Community & Health', icon: Heart, color: 'from-green-500 to-green-600' },
    { key: 'tourism', label: 'Tourism & Recreation', icon: Compass, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-12 lg:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              All Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Access comprehensive municipal services and support for all your needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-12 lg:space-y-16">
            {categories.map((cat) => {
              const categoryServices = services.filter(s => s.category === cat.key);
              if (categoryServices.length === 0) return null;
              
              const CatIcon = cat.icon;
              
              return (
                <div key={cat.key} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "p-2.5 rounded-lg text-white",
                      `bg-gradient-to-br ${cat.color}`
                    )}>
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold">{cat.label}</h2>
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full mt-1" />
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {categoryServices.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <Card
                          key={service.label}
                          className="cursor-pointer group border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                          onClick={() => handleServiceClick(service)}
                          style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-start gap-4 p-6">
                              {/* Icon */}
                              <div className={cn(
                                "p-3.5 rounded-xl flex-shrink-0 text-white group-hover:scale-110 transition-transform duration-300",
                                service.bgColor
                              )}>
                                <ServiceIcon className="h-6 w-6" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                                  {service.label}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                  {service.description}
                                </p>
                              </div>

                              {/* Arrow */}
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-0.5" />
                            </div>

                            {/* Hover indicator */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 lg:mt-20 p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-2xl border border-primary/20">
            <div className="max-w-2xl">
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">Can't find what you need?</h3>
              <p className="text-muted-foreground mb-6">
                Contact us directly or submit a feedback for custom service requests.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/feedback')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  Send Feedback
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/directory')}
                  className="px-6 py-3 bg-white text-primary rounded-lg font-semibold border-2 border-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  View Directory
                  <Building2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <ModernFooter />
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </>
  );
};

export default Services;
