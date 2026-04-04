import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Heart, MapPin, Phone, Mail, Search, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernFooter } from '@/components/ModernFooter';
import { BottomNav } from '@/components/BottomNav';

import { cn } from '@/lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Office[] | Program[]>([]);

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
        console.error('Directory fetch failed, using defaults:', error);
      }
    };

    fetchDirectoryData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    const data = category === 'programs' ? programs : offices;
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = data.filter(item => {
        const searchableText = category === 'programs'
          ? `${(item as Program).name} ${(item as Program).description}`.toLowerCase()
          : `${(item as Office).name} ${(item as Office).address} ${(item as Office).phone}`.toLowerCase();
        return searchableText.includes(query);
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, category, offices, programs]);

  if (category === 'offices') {
    return (
      <>
        <ModernHeader />
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
            {/* Header */}
            <div className="mb-8 lg:mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">Offices Directory</h1>
              <p className="text-lg text-muted-foreground">
                Find contact information for municipal offices and services
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search offices by name, address, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Found {filteredData.length} office{filteredData.length !== 1 ? 's' : ''}
            </p>

            {/* Offices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredData as Office[]).map((office, index) => (
                <Card
                  key={office.id ?? office.name}
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
                >
                  <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-white/20">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{office.name}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-sm text-foreground mt-1">{office.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${office.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => window.location.href = `tel:${office.phone}`}
                      className="w-full mt-4 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      Call Office
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No offices found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => navigate('/directory')}
                className="gap-2"
              >
                ← Back to Directory
              </Button>
            </div>
          </div>

          <ModernFooter />
        </div>
        <BottomNav />
      </>
    );
  }

  if (category === 'programs') {
    return (
      <>
        <ModernHeader />
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
            {/* Header */}
            <div className="mb-8 lg:mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">Municipal Programs</h1>
              <p className="text-lg text-muted-foreground">
                Discover available programs and support services
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search programs by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Found {filteredData.length} program{filteredData.length !== 1 ? 's' : ''}
            </p>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(filteredData as Program[]).map((program, index) => (
                <Card
                  key={program.id ?? program.name}
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
                >
                  <CardHeader className="bg-gradient-to-br from-green-500 to-green-600 text-white pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-white/20">
                        <Heart className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {program.description}
                    </p>

                    {/* Learn More Button */}
                    <button
                      onClick={() => navigate('/feedback')}
                      className="w-full mt-6 px-4 py-2.5 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No programs found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => navigate('/directory')}
                className="gap-2"
              >
                ← Back to Directory
              </Button>
            </div>
          </div>

          <ModernFooter />
        </div>
        <BottomNav />
      </>
    );
  }

  // Main Directory page showing both
  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-12 lg:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">Municipality Directory</h1>
            <p className="text-lg text-muted-foreground">
              Access offices, programs, and contact information
            </p>
          </div>

          {/* Directory Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offices Card */}
            <Card
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => navigate('/directory/offices')}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Building2 className="h-32 w-32 text-white" />
                </div>
                <Building2 className="h-12 w-12 text-white relative z-10" />
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">Offices Directory</h2>
                <p className="text-muted-foreground mb-4">
                  Find contact information for all municipal offices
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-200">
                  Browse Offices
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            {/* Programs Card */}
            <Card
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => navigate('/directory/programs')}
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 h-32 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Heart className="h-32 w-32 text-white" />
                </div>
                <Heart className="h-12 w-12 text-white relative z-10" />
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">Municipal Programs</h2>
                <p className="text-muted-foreground mb-4">
                  Explore available programs and support services
                </p>
                <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all duration-200">
                  Browse Programs
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ModernFooter />
      </div>
      <BottomNav />
    </>
  );
};

export default Directory;
