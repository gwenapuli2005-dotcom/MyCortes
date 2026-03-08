import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BottomNav } from '@/components/BottomNav';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Loader2, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { BarangaySelect } from '@/components/BarangaySelect';
import { categories } from '@/components/request-service/serviceCategories';
import { DynamicFormFields } from '@/components/request-service/DynamicFormFields';

const RequestService = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const { user } = useAuth();
  const [category, setCategory] = useState(initialCategory);
  const [barangay, setBarangay] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = categories.find(c => c.value === category);

  const handleFieldChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) newErrors.category = 'Pumili ng uri ng serbisyo';
    if (!barangay) newErrors.barangay = 'Pumili ng iyong barangay';

    if (selectedCategory) {
      for (const field of selectedCategory.fields) {
        if (field.required && !formValues[field.name]?.trim()) {
          newErrors[field.name] = `${field.label.split(' / ')[0]} ay kailangan`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Mag-sign in muna para mag-request ng serbisyo');
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast.error('Pakitama ang mga error sa form');
      return;
    }

    setIsSubmitting(true);

    // Build a structured description from all form values
    const detailLines = selectedCategory?.fields
      .filter(f => formValues[f.name])
      .map(f => {
        const label = f.label.split(' / ')[0];
        let value = formValues[f.name];
        // For select fields, show the label not the value
        if (f.type === 'select' && f.options) {
          const opt = f.options.find(o => o.value === value);
          if (opt) value = opt.label;
        }
        return `${label}: ${value}`;
      }) || [];

    const fullName = formValues.fullName || formValues.ownerName || formValues.requestorName || formValues.applicantName || formValues.childName || '';

    const { error } = await supabase.from('service_requests').insert({
      user_id: user.id,
      title: `${selectedCategory?.label || category} - ${fullName}`,
      description: detailLines.join('\n'),
      category: selectedCategory?.label || category,
      location: barangay,
      photo_url: photoUrl,
    });

    if (error) {
      toast.error('Hindi nai-submit ang request. Subukan ulit.');
    } else {
      setIsSuccess(true);
      toast.success('Matagumpay na nai-submit ang request!');
    }

    setIsSubmitting(false);
  };

  // Reset form when category changes
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setFormValues({});
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="app-container">
          <div className="px-4 pt-12 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Nai-submit na ang Request!</h1>
            <p className="text-muted-foreground text-center mb-4">
              Matagumpay na nai-submit ang iyong request.
            </p>
            <Card variant="elevated" className="w-full mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Ano ang susunod?</p>
                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Hintayin ang SMS/notification kapag handa na ang dokumento</li>
                      <li>Pumunta sa Municipal Hall para kunin</li>
                      <li>Magdala ng valid ID at bayad (kung kailangan)</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Uwi / Go Home
              </Button>
              <Button onClick={() => navigate('/my-requests')}>
                Tingnan ang Requests
              </Button>
            </div>
          </div>
        </div>
        <BottomNav currentPath="/services" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8 lg:pt-14">
      <div className="app-container lg:max-w-2xl">
        {/* Header */}
        <div className="hero-gradient px-4 pt-12 pb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Bumalik</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Request ng Dokumento/Serbisyo</h1>
              <p className="text-white/70 text-sm">Online request, kunin sa Municipal Hall</p>
            </div>
          </div>
        </div>

        {/* Curved transition */}
        <div className="h-6 bg-background rounded-t-3xl -mt-6 relative z-10" />

        {/* Form */}
        <div className="px-4 -mt-2">
          <AuthGuard fallback="message">
            <Card variant="elevated" className="animate-slide-up">
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Step 1: Select Service Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Uri ng Serbisyo/Dokumento <span className="text-destructive">*</span>
                    </label>
                    <Select value={category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pumili ng serbisyo / Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && (
                      <p className="text-xs text-muted-foreground italic">{selectedCategory.description}</p>
                    )}
                    {errors.category && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Step 2: Dynamic Fields based on category */}
                  {selectedCategory && (
                    <>
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-primary mb-4">
                          📋 Mga Detalye para sa {selectedCategory.label}
                        </p>
                        <div className="space-y-4">
                          <DynamicFormFields
                            fields={selectedCategory.fields}
                            values={formValues}
                            errors={errors}
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>

                      {/* Barangay */}
                      <div className="border-t pt-4">
                        <BarangaySelect
                          value={barangay}
                          onValueChange={(v) => { setBarangay(v); setErrors(prev => ({ ...prev, barangay: '' })); }}
                          error={errors.barangay}
                        />
                      </div>

                      {/* Photo Upload */}
                      <PhotoUpload
                        label="Suportang Dokumento/ID (Opsyonal)"
                        onUpload={setPhotoUrl}
                        currentUrl={photoUrl}
                        onRemove={() => setPhotoUrl(null)}
                      />

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'I-submit ang Request'
                        )}
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </AuthGuard>
        </div>
      </div>

      <BottomNav currentPath="/services" />
    </div>
  );
};

export default RequestService;
