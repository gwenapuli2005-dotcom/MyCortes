import { useNavigate } from 'react-router-dom';
import { Phone, Shield, AlertTriangle, HeartPulse, Truck, AlertCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernFooter } from '@/components/ModernFooter';
import { BottomNav } from '@/components/BottomNav';


const contacts = [
  { 
    label: 'Police', 
    number: '117', 
    icon: Shield, 
    description: 'Police emergency and assistance',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    label: 'Fire Department', 
    number: '911', 
    icon: Truck, 
    description: 'Fire emergency response',
    color: 'from-red-500 to-red-600'
  },
  { 
    label: 'Medical Emergency', 
    number: '911', 
    icon: HeartPulse, 
    description: 'Ambulance and medical aid',
    color: 'from-green-500 to-green-600'
  },
  { 
    label: 'Disaster Response', 
    number: '911', 
    icon: AlertTriangle, 
    description: 'Disaster management and rescue',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    label: 'Municipal Hotline', 
    number: '0921-000-000', 
    icon: Phone, 
    description: 'General municipal assistance',
    color: 'from-purple-500 to-purple-600'
  },
];

const Emergency = () => {
  const navigate = useNavigate();

  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-background to-muted/30 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          {/* Alert Banner */}
          <div className="mb-8 lg:mb-12 p-6 lg:p-8 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl text-white shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-7 w-7 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Emergency Contacts</h1>
                <p className="text-lg text-red-100">
                  Call immediately if you have an urgent situation. Available 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="p-4 lg:p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
              <Clock className="h-6 w-6 text-blue-500 mb-2" />
              <p className="font-semibold text-foreground">Available</p>
              <p className="text-sm text-muted-foreground">24 hours a day, 7 days a week</p>
            </div>
            <div className="p-4 lg:p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
              <Phone className="h-6 w-6 text-green-500 mb-2" />
              <p className="font-semibold text-foreground">Quick Response</p>
              <p className="text-sm text-muted-foreground">Tap any number to call directly</p>
            </div>
            <div className="p-4 lg:p-6 bg-white rounded-xl shadow-md border-l-4 border-purple-500">
              <MapPin className="h-6 w-6 text-purple-500 mb-2" />
              <p className="font-semibold text-foreground">Local Coverage</p>
              <p className="text-sm text-muted-foreground">Serving Cortes, Surigao del Sur</p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Emergency Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact, index) => {
                const Icon = contact.icon;
                const [colorStart, colorEnd] = contact.color.split(' to-');
                
                return (
                  <div
                    key={contact.number}
                    className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Color Header */}
                    <div className={`bg-gradient-to-br ${contact.color} p-6 text-white relative h-24 flex items-end`}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">{contact.label}</p>
                          <p className="text-white/90 text-sm">{contact.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white p-6">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Call:</p>
                        <p className="text-3xl font-bold text-foreground">{contact.number}</p>
                      </div>

                      {/* Call Button */}
                      <a href={`tel:${contact.number}`} className="block w-full">
                        <button
                          className={`w-full px-4 py-3 bg-gradient-to-r ${contact.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn`}
                        >
                          <Phone className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                          Call Now
                        </button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 lg:p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">Important Guidelines</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• Call only for genuine emergencies</li>
                  <li>• Provide clear and accurate information about the situation</li>
                  <li>• Stay calm and follow instructions from responders</li>
                  <li>• For non-emergencies, use the Municipal Hotline</li>
                  <li>• Save these numbers in your phone for quick access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 lg:p-8">
            <h3 className="text-xl font-bold mb-3">Need Other Assistance?</h3>
            <p className="text-muted-foreground mb-6">
              For non-emergency issues, report them through our services portal or contact the municipal office.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/report-issue')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
              >
                Report an Issue
              </button>
              <button
                onClick={() => navigate('/directory')}
                className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-200"
              >
                View Directory
              </button>
            </div>
          </div>
        </div>

        <ModernFooter />
      </div>
      <BottomNav />
    </>
  );
};

export default Emergency;
