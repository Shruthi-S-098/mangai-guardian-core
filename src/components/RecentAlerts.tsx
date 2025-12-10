import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  alert_message: string;
  alert_time: string;
  status: string;
}

const RecentAlerts = ({ userId }: { userId: string }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchAlerts();
  }, [userId]);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", userId)
      .order("alert_time", { ascending: false })
      .limit(5);

    setAlerts(data || []);
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No alerts sent yet</p>
        <p className="text-sm">Your SOS history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="p-3 bg-muted/30 rounded-lg border border-border/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm">{alert.alert_message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(alert.alert_time), "PPpp")}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success-foreground">
              {alert.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentAlerts;