import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusHistory {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_at: string;
  notes: string | null;
}

interface StatusTrackerProps {
  status: string;
  history: StatusHistory[];
  createdAt: string;
}

const statusStages = [
  { key: 'pending', label: 'Submitted', icon: ClipboardList, color: 'bg-blue-100 text-blue-700' },
  { key: 'in_progress', label: 'Under Review', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  { key: 'completed', label: 'Approved', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-700' },
];

const getStageIndex = (status: string) => {
  return statusStages.findIndex(s => s.key === status);
};

const isRejectPath = (history: StatusHistory[]) => {
  return history.some(h => h.new_status === 'rejected');
};

export const StatusTracker = ({ status, history, createdAt }: StatusTrackerProps) => {
  const currentStageIndex = getStageIndex(status);
  const isRejected = status === 'rejected';
  const isRejectFlow = isRejectPath(history);

  // Get the active stages based on the flow
  let displayStages = [...statusStages];
  if (isRejected || isRejectFlow) {
    displayStages = statusStages.filter(s => s.key !== 'completed');
  }

  const getHistoryForStage = (stageKey: string) => {
    return history.find(h => h.new_status === stageKey);
  };

  return (
    <div className="space-y-6">
      {/* Main Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Request Status Journey</h3>
              <p className="text-sm text-muted-foreground">
                Submitted on {format(new Date(createdAt), 'MMMM d, yyyy')}
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {displayStages.map((stage, index) => {
                const stageHistory = getHistoryForStage(stage.key);
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.key} className="flex gap-4">
                    {/* Circle and line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2',
                          isCompleted
                            ? isCurrent
                              ? 'bg-primary border-primary text-white scale-110'
                              : 'bg-primary/20 border-primary text-primary'
                            : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                        )}
                      >
                        {isCompleted ? <Icon className="w-5 h-5" /> : <span>{index + 1}</span>}
                      </div>
                      {index < displayStages.length - 1 && (
                        <div
                          className={cn(
                            'w-1 h-12 mt-2 transition-all duration-300',
                            isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                          )}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{stage.label}</h4>
                        <Badge
                          variant={isCompleted ? 'default' : 'secondary'}
                          className={stage.color}
                        >
                          {stage.key}
                        </Badge>
                      </div>

                      {stageHistory ? (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Updated on{' '}
                            {format(new Date(stageHistory.changed_at), 'MMMM d, yyyy p')}
                          </p>
                          {stageHistory.notes && (
                            <p className="italic text-foreground/80">
                              Note: {stageHistory.notes}
                            </p>
                          )}
                        </div>
                      ) : isCompleted ? (
                        <p className="text-sm text-muted-foreground">
                          {isCurrent ? 'Currently at this stage' : 'Completed'}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="bg-blue-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {status === 'pending' && 'Your request has been submitted and is waiting for review.'}
              {status === 'in_progress' && 'Your request is under review by the government team.'}
              {status === 'completed' && 'Your request has been approved and processed.'}
              {status === 'rejected' && 'Your request has been rejected. Please contact support for more information.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
