"use client";

import { DashboardHeader } from "./header";
import { useEffect, useState } from "react";
import { CurrentActivity, LastUsedApps } from "../../types";
import { DashboardContent } from "./content";

export const DashboardView = () => {
  const [currentActivity, setCurrentActivity] = useState<CurrentActivity>(null);
  const [lastUsedApps, setLastUsedApps] = useState<LastUsedApps>(null);

  useEffect(() => {
    const trackerApi = window.trackerAPI;
    trackerApi.getCurrentActivity().then(setCurrentActivity);

    trackerApi.getLastUsedApps().then(setLastUsedApps);
  }, []);

  const [isLiveView, setIsLiveView] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        isLiveView={isLiveView}
        onToggleLiveView={() => setIsLiveView(!isLiveView)}
      />

      <DashboardContent
        isLiveView={isLiveView}
        currentActivity={currentActivity}
        lastUsedApps={lastUsedApps || []}
      />
    </div>
  );
};
