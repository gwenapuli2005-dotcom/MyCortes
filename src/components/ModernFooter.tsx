import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ModernFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide footer on certain routes
  const hideFooterRoutes = ['/auth'];
  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-muted border-t border-border/50 mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Branding */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Municipality of</p>
                <p className="text-base sm:text-lg font-bold text-foreground">myCortes</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your digital gateway to municipal services and community engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Quick Links</h3>
            <nav className="space-y-1.5 sm:space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Services', path: '/services' },
                { label: 'Directory', path: '/directory' },
                { label: 'Community', path: '/community' },
                { label: 'Updates', path: '/updates' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Services</h3>
            <nav className="space-y-1.5 sm:space-y-2">
              {[
                { label: 'Request Service', path: '/request-service' },
                { label: 'Report Issue', path: '/report-issue' },
                { label: 'Emergency', path: '/emergency' },
                { label: 'Tourist Spots', path: '/tourist-spots' },
                { label: 'Feedback', path: '/feedback' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                  Municipality of Cortes, Surigao del Sur
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+63921000111"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  (0921) 000-111
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@cortes.gov.ph"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 truncate"
                >
                  info@cortes.gov.ph
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 py-4 sm:py-6 mb-4 sm:mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {currentYear} Municipality of Cortes. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Made with love */}
          <p className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
            Made with <Heart className="h-3 w-3 text-accent" /> for Cortes
          </p>
        </div>
      </div>
    </footer>
  );
};
