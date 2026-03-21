import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Edit2, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type GovernmentWallImage = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
};

const GovernmentWall = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GovernmentWallImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GovernmentWallImage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('government_wall_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('uploads')
        .upload(`government-wall/${fileName}`, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(`government-wall/${fileName}`);

      return data?.publicUrl || null;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleAddImage = async () => {
    if (!newTitle.trim() || !newImageFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    try {
      const imageUrl = await handleFileUpload(newImageFile);
      if (!imageUrl) return;

      const { error } = await supabase
        .from('government_wall_images')
        .insert({
          title: newTitle,
          description: newDescription,
          image_url: imageUrl,
          display_order: images.length + 1,
        });

      if (error) throw error;

      toast.success('Image added successfully');
      setNewTitle('');
      setNewDescription('');
      setNewImageFile(null);
      setIsAddDialogOpen(false);
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage || !editTitle.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('government_wall_images')
        .update({
          title: editTitle,
          description: editDescription,
        })
        .eq('id', selectedImage.id);

      if (error) throw error;

      toast.success('Image updated successfully');
      setIsEditDialogOpen(false);
      setSelectedImage(null);
      fetchImages();
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('government_wall_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const openEditDialog = (image: GovernmentWallImage) => {
    setSelectedImage(image);
    setEditTitle(image.title);
    setEditDescription(image.description);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="app-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Government Wall</h1>
            <p className="text-muted-foreground mt-1">Manage government announcements and images</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </div>

        {/* Add Image Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Image description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm border rounded-md p-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddImage} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Add Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Image Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-4">
                <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full h-48 object-cover rounded-md" />
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Image title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Image description"
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateImage} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Images Grid */}
        {images.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No images yet. Add your first government announcement!</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden bg-muted">
                  <img src={image.image_url} alt={image.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{image.title}</h3>
                  {image.description && <p className="text-sm text-muted-foreground mb-4">{image.description}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(image)} className="flex-1">
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)} className="flex-1">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentWall;
