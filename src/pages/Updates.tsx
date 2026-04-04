import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernFooter } from '@/components/ModernFooter';
import { BottomNav } from '@/components/BottomNav';
import { NotificationList } from '@/components/NotificationList';
import { AnnouncementDetailDialog } from '@/components/AnnouncementDetailDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, AlertTriangle, Calendar, Loader2, ArrowRight, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  type: 'general' | 'urgent' | 'event';
  published_at: string;
  image_url: string | null;
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'request_update' | 'approval' | 'rejection' | 'completion';
  is_read: boolean;
  created_at: string;
}

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
};

const Updates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'general' | 'urgent' | 'event'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('published_at', { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
    }
    setIsLoading(false);
  };

  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('system_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    await supabase
      .from('system_notifications')
      .update({ is_read: true })
      .eq('id', id);

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3">Updates & Announcements</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Stay informed with the latest news and updates from the municipality
            </p>
          </div>

          {/* Tabs for Announcements and Notifications */}
          <Tabs defaultValue="announcements" className="space-y-6">
            <TabsList>
              <TabsTrigger value="announcements">
                <Megaphone className="w-4 h-4 mr-2" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="space-y-6">
              {/* Filter Buttons - Scrollable on Mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
                {['all', 'general', 'urgent', 'event'].map((filterValue) => {
                  const isActive = filter === filterValue;
                  const config = filterValue === 'all' ? null : typeConfig[filterValue as keyof typeof typeConfig];
                  
                  return (
                    <button
                      key={filterValue}
                      onClick={() => setFilter(filterValue as any)}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 sm:flex-shrink",
                        isActive
                          ? config
                            ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                            : "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {filterValue === 'all' ? 'All Updates' : config?.label}
                    </button>
                  );
                })}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Announcements List */}
              {!isLoading && filteredAnnouncements.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {filteredAnnouncements.map((announcement, index) => {
                    const config = typeConfig[announcement.type];
                    const Icon = config.icon;
                    
                    return (
                      <Card
                        key={announcement.id}
                        className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border-0"
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                          setIsDetailOpen(true);
                        }}
                        style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            {announcement.image_url && (
                              <div className="relative w-full sm:w-48 h-32 sm:h-auto overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={announcement.image_url}
                                  alt={announcement.title}
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
                                    {format(new Date(announcement.published_at), 'MMM d, yyyy')}
                                  </span>
                                </div>

                                {/* Title and Excerpt */}
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                  {announcement.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                  {announcement.excerpt || announcement.content}
                                </p>
                              </div>

                              {/* Read More */}
                              <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-4 text-primary font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-200">
                                Read More
                                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
              {!isLoading && filteredAnnouncements.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Megaphone className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium text-muted-foreground">No announcements found</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    Check back later for updates and important announcements
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              {!user ? (
                <Card className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Sign in to view your notifications</p>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="mt-4"
                  >
                    Sign In
                  </Button>
                </Card>
              ) : (
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <ModernFooter />
      </div>
      <BottomNav />

      {/* Detail Dialog */}
      {selectedAnnouncement && (
        <AnnouncementDetailDialog
          announcement={selectedAnnouncement}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </>
  );
};

export default Updates;
