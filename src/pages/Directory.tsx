import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Heart, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Office = {
  id?: string;
  name: string;
  address: string;
  phone: string;
};

type Program = {
  id?: string;
  name: string;
  description: string;
};

const DEFAULT_OFFICES: Office[] = [
  { name: 'Municipal Office', address: 'Brgy. 1, Cortes', phone: '0921-000-111' },
  { name: 'Health Office', address: 'Brgy. 2, Cortes', phone: '0921-000-222' },
  { name: 'Environment Office', address: 'Brgy. 3, Cortes', phone: '0921-000-333' },
];

const DEFAULT_PROGRAMS: Program[] = [
  { name: 'Community Livelihood Program', description: 'Livelihood grants and training for local families.' },
  { name: 'Youth Empowerment Program', description: 'Skills development and leadership for youth.' },
  { name: 'Agricultural Support Program', description: 'Farmers support, workshops, and inputs distribution.' },
];

const Directory = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [offices, setOffices] = useState<Office[]>(DEFAULT_OFFICES);
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    const fetchDirectoryData = async () => {
      try {
        const { data: officeData, error: officeError } = await supabase
          .from('directory_entries')
          .select('*')
          .eq('entry_type', 'office')
          .order('created_at', { ascending: true });

        if (!officeError && officeData?.length) {
          setOffices(officeData.map((o: any) => ({ id: o.id, name: o.name, address: o.address, phone: o.phone })));
        }

        const { data: programData, error: programError } = await supabase
          .from('directory_entries')
          .select('*')
          .eq('entry_type', 'program')
          .order('created_at', { ascending: true });

        if (!programError && programData?.length) {
          setPrograms(programData.map((p: any) => ({ id: p.id, name: p.name, description: p.description })));
        }
      } catch (error) {
        // If table doesn't exist yet, we keep defaults.
        console.error('Directory fetch failed, using defaults:', error);
      }
    };

    fetchDirectoryData();
  }, []);

  const renderBackButton = () => (
    <Button variant="outline" onClick={() => navigate('/services')}>
      Back to Services
    </Button>
  );

  if (category === 'offices') {
    return (
      <div className="min-h-screen bg-background pb-20 pt-10">
        <div className="app-container">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Offices Directory</h1>
            {renderBackButton()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offices.map((office) => (
              <Card key={office.id ?? office.name} variant="elevated">
                <CardContent>
                  <h2 className="text-lg font-semibold">{office.name}</h2>
                  <p className="text-sm text-muted-foreground">{office.address}</p>
                  <a href={`tel:${office.phone}`} className="text-sm text-primary font-medium hover:underline mt-1 inline-block">Call: {office.phone}</a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (category === 'programs') {
    return (
      <div className="min-h-screen bg-background pb-20 pt-10">
        <div className="app-container">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Programs Directory</h1>
            {renderBackButton()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((program) => (
              <Card key={program.id ?? program.name} variant="elevated">
                <CardContent>
                  <h2 className="text-lg font-semibold">{program.name}</h2>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="app-container">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Directory</h1>
          {renderBackButton()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/directory/offices')}>
            <CardHeader className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Offices</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Browse municipal offices and contact details.</CardContent>
          </Card>

          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/directory/programs')}>
            <CardHeader className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-emergency" />
              <CardTitle>Programs</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Browse local development programs.</CardContent>
          </Card>

          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/emergency')}>
            <CardHeader className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-success" />
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">View and call emergency numbers instantly.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Directory;
