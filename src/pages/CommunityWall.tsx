import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Heart, 
  Megaphone, 
  AlertTriangle, 
  Calendar,
  Search,
  Loader2,
  X,
  Copy
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  type: 'general' | 'urgent' | 'event';
  published_at: string;
  image_url: string | null;
  content_type: 'announcement';
}

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
  content_type: 'project';
}

type WallItem = Announcement | Project;

const typeConfig = {
  general: { 
    icon: Megaphone, 
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    label: "General",
    badge: "bg-blue-100 text-blue-700"
  },
  urgent: { 
    icon: AlertTriangle, 
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    label: "Urgent",
    badge: "bg-red-100 text-red-700"
  },
  event: { 
    icon: Calendar, 
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    label: "Event",
    badge: "bg-green-100 text-green-700"
  },
  project: {
    icon: Copy,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    label: "Government",
    badge: "bg-purple-100 text-purple-700"
  }
};


const CommunityWall = () => {
  const navigate = useNavigate();
  const [wallItems, setWallItems] = useState<WallItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'government'>('all');

  useEffect(() => {
    fetchWallContent();
  }, []);

  const fetchWallContent = async () => {
    try {
      setIsLoading(true);
      
      // Fetch announcements
      const { data: announcementData, error: announcementError } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false });

      if (announcementError) throw announcementError;

      // Fetch projects
      const { data: projectData, error: projectError } = await supabase
        .from('government_wall_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (projectError) throw projectError;

      // Format and combine
      const announcements: Announcement[] = (announcementData || []).map(a => ({
        ...a,
        content_type: 'announcement' as const
      }));

      const projects: Project[] = (projectData || []).map(p => ({
        ...p,
        content_type: 'project' as const
      }));

      const combined = [...announcements, ...projects] as WallItem[];
      combined.sort((a, b) => {
        const dateA = 'published_at' in a ? new Date(a.published_at) : new Date((a as Project).created_at);
        const dateB = 'published_at' in b ? new Date(b.published_at) : new Date((b as Project).created_at);
        return dateB.getTime() - dateA.getTime();
      });

      setWallItems(combined);

      // Initialize likes
      const likesMap: Record<string, number> = {};
      combined.forEach(item => {
        likesMap[item.id] = Math.floor(Math.random() * 50);
      });
      setLikes(likesMap);
    } catch (error) {
      console.error('Error fetching wall content:', error);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = () => {
    let filtered = wallItems;

    // Filter by tab
    if (activeTab === 'announcements') {
      filtered = filtered.filter(item => item.content_type === 'announcement');
    } else if (activeTab === 'government') {
      filtered = filtered.filter(item => item.content_type === 'project');
    }

    // Filter by search
    filtered = filtered.filter(item => {
      const title = item.title.toLowerCase();
      const content = 'content' in item ? (item as Announcement).content.toLowerCase() : (item as Project).description.toLowerCase();
      return title.includes(searchQuery.toLowerCase()) || content.includes(searchQuery.toLowerCase());
    });

    return filtered;
  };

  const handleLike = (itemId: string) => {
    setLikes(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1 sm:mb-2">Community Wall</h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              Announcements and government projects
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-9 sm:h-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 sm:mb-8 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={activeTab === 'announcements' ? 'default' : 'outline'}
            onClick={() => setActiveTab('announcements')}
            className="whitespace-nowrap gap-2"
          >
            <Megaphone className="h-4 w-4" />
            Announcements
          </Button>
          <Button
            variant={activeTab === 'government' ? 'default' : 'outline'}
            onClick={() => setActiveTab('government')}
            className="whitespace-nowrap gap-2"
          >
            <Copy className="h-4 w-4" />
            Government
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Wall Items List */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {filteredItems.map((item, index) => {
              const isAnnouncement = item.content_type === 'announcement';
              const config = isAnnouncement 
                ? typeConfig[(item as Announcement).type] 
                : typeConfig.project;
              const Icon = config.icon;
              const likesCount = likes[item.id] || 0;

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border-0"
                  style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      {item.image_url && (
                        <div className="relative w-full sm:w-48 h-32 sm:h-auto overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col justify-between">
                        <div>
                          {/* Badge and Type */}
                          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                            <div className={cn("p-1 sm:p-1.5 rounded-lg text-white bg-gradient-to-br flex-shrink-0", config.color)}>
                              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", config.badge)}>
                              {config.label}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                              {format(
                                new Date(isAnnouncement ? (item as Announcement).published_at : (item as Project).created_at),
                                'MMM d, yyyy'
                              )}
                            </span>
                          </div>

                          {/* Title and Excerpt */}
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {isAnnouncement 
                              ? ((item as Announcement).excerpt || (item as Announcement).content)
                              : (item as Project).description
                            }
                          </p>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-muted-foreground hover:text-destructive text-xs sm:text-sm"
                            onClick={() => handleLike(item.id)}
                          >
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{likesCount}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Megaphone className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-base sm:text-lg font-medium text-muted-foreground">No posts found</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Check back later for announcements and government projects
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CommunityWall;
