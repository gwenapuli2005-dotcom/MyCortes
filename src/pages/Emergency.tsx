import { useNavigate } from 'react-router-dom';
import { Phone, Shield, AlertTriangle, HeartPulse, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contacts = [
  { label: 'Police', number: '117', icon: Shield },
  { label: 'Fire Department', number: '911', icon: Truck },
  { label: 'Medical Emergency', number: '911', icon: HeartPulse },
  { label: 'Disaster Response', number: '911', icon: AlertTriangle },
  { label: 'Municipal Hotline', number: '0921-000-000', icon: Phone },
];

const Emergency = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="app-container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Emergency Contacts</h1>
            <p className="text-muted-foreground mt-1">Tap any number to call directly from your device.</p>
          </div>
          <button className="text-sm px-3 py-2 border rounded-md text-muted-foreground hover:bg-slate-100" onClick={() => navigate('/services')}>
            Back to Services
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <div key={contact.number} className="rounded-xl border p-4 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-5 w-5 text-emergency" />
                <div>
                  <p className="text-lg font-semibold">{contact.label}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              <a href={`tel:${contact.number}`} className="inline-block">
                <Button className="w-full" variant="emergency">Call Now</Button>
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p className="font-semibold">Note:</p>
        <p>These contact numbers are for urgent government and municipal assistance. Use appropriately.</p>
      </div>
    </div>
  </div>
);
};

export default Emergency;
