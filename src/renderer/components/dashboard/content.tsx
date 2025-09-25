import { Clock, BarChart3, Timer } from "lucide-react";
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { CurrentActivity, LastUsedApps } from "../../types";
import { FC, useEffect, useState } from "react";
import { formatTime } from "../../lib/utils";

type DashboardContentProps = {
  lastUsedApps: LastUsedApps;
  currentActivity: CurrentActivity;
  isLiveView: boolean;
};

export const DashboardContent = ({
  lastUsedApps,
  currentActivity,
  isLiveView,
}: DashboardContentProps) => {
  const totalTime = lastUsedApps.reduce((acc, item) => acc + item.time, 0);

  //TODO: make productive time? hmm..
  // const productiveTime = lastUsedApps
  //   .filter((item) => item.category === "Productive")
  //   .reduce((acc, item) => acc + item.time, 0);
  //<CardContent>
  //            <div className="text-2xl font-bold text-primary">
  //              {formatTime(productiveTime)}
  //            </div>
  //            <p className="text-xs text-muted-foreground">
  //              {Math.round((productiveTime / totalTime) * 100)}% of total
  //            </p>
  //          </CardContent>
  //TODO: make productive time? hmm..
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Focus Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatTime(totalTime)}
            </div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productive Time (soon)
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Focus Score (soon)
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">-%</div>
            <p className="text-xs text-muted-foreground">(soon) </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {lastUsedApps.length}
            </div>
            <p className="text-xs text-muted-foreground">Used today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {isLiveView && currentActivity && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Current Activity
              </CardTitle>
              <CardDescription>
                What you're working on right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {currentActivity.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentActivity.title}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {currentActivity.platform}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      <CurrentSessionTime
                        initialTime={currentActivity.duration}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current session
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>How you spent your time today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lastUsedApps}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="time"
                  >
                    {lastUsedApps.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatTime(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Today's App Usage
          </CardTitle>
          <CardDescription>
            Time spent in each application with precision timing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lastUsedApps.map((app, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" />
                  <div>
                    <h4 className="font-medium text-foreground">{app.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {Math.round((app.time / totalTime) * 100)}% of total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {formatTime(app.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type CurrentSessionTimeProps = {
  initialTime: number;
};
const CurrentSessionTime: FC<CurrentSessionTimeProps> = ({ initialTime }) => {
  const [currentTime, setCurrentTime] = useState(initialTime);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <> {formatTime(currentTime)}</>;
};
