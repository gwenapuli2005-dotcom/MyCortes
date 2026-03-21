import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Phone, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminLayout } from '@/components/admin/AdminLayout';

type DirectoryEntry = {
  id: string;
  entry_type: 'office' | 'program';
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  is_active: boolean;
};

const AdminDirectory = () => {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'office' | 'program'>('office');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DirectoryEntry | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', address: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('directory_entries')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load directory entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('directory_entries')
          .update({
            name: formData.name,
            description: formData.description || null,
            address: formData.address || null,
            phone: formData.phone || null,
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Entry updated successfully');
      } else {
        const { error } = await supabase
          .from('directory_entries')
          .insert({
            entry_type: activeTab,
            name: formData.name,
            description: formData.description || null,
            address: formData.address || null,
            phone: formData.phone || null,
          });

        if (error) throw error;
        toast.success('Entry created successfully');
      }

      resetForm();
      setIsDialogOpen(false);
      fetchEntries();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('directory_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete entry');
    }
  };

  const openEditDialog = (entry: DirectoryEntry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name,
      description: entry.description || '',
      address: entry.address || '',
      phone: entry.phone || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', address: '', phone: '' });
    setEditingEntry(null);
  };

  const filteredEntries = entries.filter((e) => e.entry_type === activeTab);

  if (isLoading) {
    return (
      <AdminLayout title="Directory Management" subtitle="Manage offices and programs">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Directory Management" subtitle="Manage offices and programs">
      <div className="mb-6 flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'office' | 'program')}>
          <TabsList>
            <TabsTrigger value="office">Offices ({entries.filter(e => e.entry_type === 'office').length})</TabsTrigger>
            <TabsTrigger value="program">Programs ({entries.filter(e => e.entry_type === 'program').length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab === 'office' ? 'Office' : 'Program'}
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit' : 'Add'} {activeTab === 'office' ? 'Office' : 'Program'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Entry name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                rows={3}
              />
            </div>
            {activeTab === 'office' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Office address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contact number"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEdit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingEntry ? 'Save Changes' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entries Grid */}
      {filteredEntries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No {activeTab}s yet.</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add First {activeTab === 'office' ? 'Office' : 'Program'}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{entry.name}</h3>
                {entry.description && <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>}
                {activeTab === 'office' && (
                  <>
                    {entry.address && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.address}</span>
                      </div>
                    )}
                    {entry.phone && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.phone}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(entry)} className="flex-1">
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(entry.id)} className="flex-1">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDirectory;
