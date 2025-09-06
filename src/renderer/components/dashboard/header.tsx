import { Eye, Pause, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

type DashboardHeaderProps = {
  isLiveView: boolean;
  onToggleLiveView: () => void;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
};
export const DashboardHeader = ({
  isLiveView,
  onToggleLiveView,
  setCurrentTime,
}: DashboardHeaderProps) => {
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    if (isTracking && isLiveView) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, isLiveView]);
  return (
    <div className="border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Focus Dashboard
          </h1>
          <p className="text-muted-foreground">
            {isLiveView
              ? "Live tracking & today's focus summary"
              : "Today's focus summary"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <Switch checked={isLiveView} onCheckedChange={onToggleLiveView} />
            <span className="text-sm text-muted-foreground">Live View</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <div
              className={`w-2 h-2 rounded-full ${isTracking ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
            />
            {isTracking ? "Tracking" : "Paused"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
