"use client";

import { DashboardHeader } from "./header";
import { useState } from "react";
import { CurrentActivityData, TimeData } from "./types";
import { DashboardContent } from "./content";

const mockTimeData: TimeData[] = [
  { name: "VS Code", time: 7245, category: "Productive", color: "#10b981" },
  { name: "Chrome", time: 3661, category: "Mixed", color: "#f59e0b" },
  { name: "YouTube", time: 2734, category: "Distraction", color: "#ef4444" },
  { name: "Idle", time: 1823, category: "Idle", color: "#6b7280" },
];

const mockCurrentActivity: CurrentActivityData = {
  name: "Visual Studio Code",
  window: "focus-flow - dashboard-view.tsx",
  duration: 1847,
  category: "Productive",
};

export const DashboardView = () => {
  const [isLiveView, setIsLiveView] = useState(true);
  const [currentTime, setCurrentTime] = useState<number>(
    mockCurrentActivity.duration
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        isLiveView={isLiveView}
        onToggleLiveView={() => setIsLiveView(!isLiveView)}
        setCurrentTime={setCurrentTime}
      />

      <DashboardContent
        isLiveView={isLiveView}
        currentActivity={mockCurrentActivity}
        timeData={mockTimeData}
        currentTime={currentTime}
      />
    </div>
  );
};
