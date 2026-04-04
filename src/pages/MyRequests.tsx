import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StatusTracker } from '@/components/StatusTracker';
import { ArrowLeft, ClipboardList, Clock, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';

interface StatusHistory {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_at: string;
  notes: string | null;
}

interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  location: string | null;
  description?: string;
  photo_url?: string;
}

const statusConfig = {
  pending: { icon: ClipboardList, color: 'bg-warning/10 text-warning', label: 'Pending' },
  in_progress: { icon: Clock, color: 'bg-primary/10 text-primary', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'bg-success/10 text-success', label: 'Completed' },
  rejected: { icon: XCircle, color: 'bg-destructive/10 text-destructive', label: 'Rejected' },
};

const MyRequests = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [statusHistory, setStatusHistory] = useState<Record<string, StatusHistory[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
      
      // Fetch status history for each request
      for (const request of data) {
        const { data: historyData } = await supabase
          .from('request_status_history')
          .select('*')
          .eq('request_id', request.id)
          .order('changed_at', { ascending: true });

        if (historyData) {
          setStatusHistory(prev => ({
            ...prev,
            [request.id]: historyData
          }));
        }
      }
    }
    setIsLoading(false);
  };

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8 lg:pt-14">
      <div className="app-container">
        {/* Header */}
        <div className="px-4 pt-12 pb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold">My Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your service requests and their status</p>
        </div>

        {/* Content - Protected by AuthGuard */}
        <AuthGuard fallback="message">
          {/* Stats */}
          <div className="px-4 mb-6">
            <Card variant="elevated">
              <CardContent className="p-0">
                <div className="grid grid-cols-3 divide-x divide-border">
                  {[
                    { label: 'Pending', value: stats.pending, color: 'text-warning' },
                    { label: 'In Progress', value: stats.in_progress, color: 'text-primary' },
                    { label: 'Completed', value: stats.completed, color: 'text-success' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center py-4">
                      <span className={cn("text-2xl font-bold", stat.color)}>{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <div className="px-4 space-y-3">
            {requests.length === 0 ? (
              <Card variant="flat" className="p-8 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No requests yet</p>
                <button
                  onClick={() => navigate('/request-service')}
                  className="text-primary font-medium mt-2 hover:underline"
                >
                  Submit your first request
                </button>
              </Card>
            ) : (
              requests.map((request, index) => {
                const config = statusConfig[request.status];
                const Icon = config.icon;
                const isExpanded = expandedId === request.id;

                return (
                  <div
                    key={request.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card 
                      variant="elevated"
                      className="cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => setExpandedId(isExpanded ? null : request.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <Badge variant="secondary" className="text-xs mb-2 inline-block">
                              {request.category}
                            </Badge>
                            <h3 className="font-semibold line-clamp-2">{request.title}</h3>
                            {request.location && (
                              <p className="text-sm text-muted-foreground mt-1">{request.location}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs whitespace-nowrap", config.color)}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-2 space-y-3 card-enter animation">
                        {request.photo_url && (
                          <Card>
                            <CardContent className="p-4">
                              <img
                                src={request.photo_url}
                                alt="Request attachment"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </CardContent>
                          </Card>
                        )}

                        {request.description && (
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Details</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {request.description}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Status Tracker */}
                        <StatusTracker
                          status={request.status}
                          history={statusHistory[request.id] || []}
                          createdAt={request.created_at}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </AuthGuard>
      </div>
      <BottomNav currentPath="/" onNavigate={(path) => navigate(path)} />
    </div>
  );
};

export default MyRequests;
