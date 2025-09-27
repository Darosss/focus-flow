export type CurrentActivity = Awaited<
  ReturnType<typeof window.trackerAPI.getCurrentActivity>
>;

export type LastUsedApps = Awaited<
  ReturnType<typeof window.trackerAPI.getLastUsedApps>
>;

export type HistoryActivity = Awaited<
  ReturnType<typeof window.trackerAPI.getHistoryActivity>
>["data"];
