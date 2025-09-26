import { FC, useEffect, useState } from "react";
import { SessionSnapshot } from "../../../tracking/types";
import { FileText, Clock, MemoryStick } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatDate, formatMemoryUsage } from "../../lib/utils";

type HistoryContentProps = {
  sessionId: number;
};

export const HistoryContent: FC<HistoryContentProps> = ({ sessionId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snapshotData, setSnapshotData] = useState<SessionSnapshot[]>([]);

  useEffect(() => {
    const fetchSessionSnapshots = async () => {
      setIsLoading(true);
      try {
        const trackerApi = window.trackerAPI;
        const result = await trackerApi.getSessionSnapshots(sessionId);

        setSnapshotData(result);
      } catch (error) {
        console.error("Failed to fetch session snapshots:", error);
        setSnapshotData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionSnapshots();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">loading</div>
              <div className="flex items-center gap-4 mt-3">loading </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (snapshotData.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">No snapshots found for this session</p>
      </div>
    );
  }
  return (
    <div className="space-y-3 p-4 max-h-96 overflow-y-auto w-full">
      {snapshotData.map((snapshot) => (
        <Card
          key={snapshot.id}
          className="hover:bg-accent/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate mb-2">
                  {snapshot.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(snapshot.snapshotTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3" />
                    <span>{formatMemoryUsage(snapshot.memoryUsage)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
