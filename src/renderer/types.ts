export type CurrentActivity = Awaited<
  ReturnType<typeof window.trackerAPI.getCurrentActivity>
>;

export type LastUsedApps = Awaited<
  ReturnType<typeof window.trackerAPI.getLastUsedApps>
>;
