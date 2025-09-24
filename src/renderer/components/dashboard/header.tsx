import { Eye } from "lucide-react";
import { Switch } from "../ui/switch";

type DashboardHeaderProps = {
  isLiveView: boolean;
  onToggleLiveView: () => void;
};
export const DashboardHeader = ({
  isLiveView,
  onToggleLiveView,
}: DashboardHeaderProps) => {
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
        </div>
      </div>
    </div>
  );
};
