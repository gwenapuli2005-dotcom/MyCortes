import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { icon: ClipboardList, label: "Pending", value: 0, color: "text-warning", bg: "bg-warning/10" },
  { icon: Clock, label: "In Progress", value: 0, color: "text-primary", bg: "bg-primary/10" },
  { icon: CheckCircle2, label: "Completed", value: 0, color: "text-success", bg: "bg-success/10" },
];

export const RequestStatusCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="px-4 lg:px-8">
      <h2 className="text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">My Requests</h2>
      <Card variant="elevated" className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => navigate(user ? '/my-requests' : '/auth')}>
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2 p-4 lg:p-6 hover:bg-muted/50 transition-all duration-300 group">
                  <div className={`p-2 lg:p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl lg:text-3xl font-bold">{stat.value}</span>
                  <span className="text-xs lg:text-sm text-muted-foreground font-medium">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
