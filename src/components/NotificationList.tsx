import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Clock as ClockIcon 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'request_update' | 'approval' | 'rejection' | 'completion';
  is_read: boolean;
  created_at: string;
  request_id?: string;
}

interface NotificationListProps {
  notifications: SystemNotification[];
  onMarkAsRead?: (id: string) => void;
  limit?: number;
}

const notificationConfig = {
  request_update: {
    icon: Clock,
    color: 'bg-blue-100 text-blue-700',
    label: 'Update',
    description: 'Your request status has been updated'
  },
  approval: {
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
    label: 'Approved',
    description: 'Your request has been approved'
  },
  completion: {
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
    label: 'Completed',
    description: 'Your request has been completed'
  },
  rejection: {
    icon: XCircle,
    color: 'bg-red-100 text-red-700',
    label: 'Rejected',
    description: 'Your request was not approved'
  }
};

export const NotificationList = ({ notifications, onMarkAsRead, limit }: NotificationListProps) => {
  const displayNotifications = limit ? notifications.slice(0, limit) : notifications;

  if (displayNotifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayNotifications.map((notification) => {
        const config = notificationConfig[notification.type];
        const Icon = config.icon;

        return (
          <Card
            key={notification.id}
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              !notification.is_read && "border-primary/50 bg-primary/5"
            )}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    config.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      {!notification.is_read && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      {config.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d, yyyy p')}
                    </span>

                    {!notification.is_read && onMarkAsRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
