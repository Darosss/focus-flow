import { activeWindow, openWindows, Result } from "get-windows";
import { ActivityTrackerSessionHandler } from "./session-handler";

export class ActivityTracker {
  private checkingActiveTabMS = 2000;
  private checkingAllTabsMS = 30000;
  private savingTimeMS = 32500;
  private sessionHandler = new ActivityTrackerSessionHandler();
  private checkingActiveTabsInterval: NodeJS.Timeout | null = null;
  private checkingAllTabsInterval: NodeJS.Timeout | null = null;

  private savingDataInterval: NodeJS.Timeout | null = null;

  async startTracking() {
    this.startTrackingActiveTab();
    this.startTrackingAllTabs();

    this.startSaveInterval();
  }

  public forceUpdate() {
    this.sessionHandler.updateCurrentData();
  }

  private startSaveInterval() {
    if (this.savingDataInterval)
      return console.log(
        "Trying to start tracking active tab, tho the interval is already on"
      );

    this.savingDataInterval = setInterval(async () => {
      this.sessionHandler.updateCurrentData();
    }, this.savingTimeMS);
  }

  private async startTrackingActiveTab() {
    if (this.checkingActiveTabsInterval)
      return console.log(
        "Trying to start tracking active tab, tho the interval is already on"
      );

    await this.onCheckActiveTabLogic();
    this.checkingActiveTabsInterval = setInterval(async () => {
      await this.onCheckActiveTabLogic();
    }, this.checkingActiveTabMS);
  }

  private isNewSession(previous: Result) {
    if (
      previous.owner?.name !==
      this.sessionHandler.getCurrentSessionData()?.appName
    )
      return true;
  }

  private async onCheckActiveTabLogic() {
    const currentActiveWindow = await activeWindow();
    const currentCheckDate = new Date();

    if (this.isNewSession(currentActiveWindow)) {
      this.sessionHandler.startNewSession(
        currentActiveWindow,
        currentCheckDate
      );
    }

    const sessionData = this.sessionHandler.getCurrentSessionData();
    if (!sessionData)
      return console.warn(
        "Trying to check active tab logic, tho the currentSessionData is null"
      );

    this.sessionHandler.pushToSessionSnapshotCache([
      {
        sessionId: sessionData.id,
        snapshotTime: currentCheckDate,
        title: currentActiveWindow.title,
        memoryUsage: currentActiveWindow.memoryUsage,
      },
    ]);
  }

  private async startTrackingAllTabs() {
    if (this.checkingAllTabsInterval)
      return console.log(
        "Trying to start tracking open tabs, tho the interval is already on"
      );

    await this.onCheckAllTabsLogic();
    this.checkingAllTabsInterval = setInterval(async () => {
      this.onCheckAllTabsLogic();
    }, this.checkingAllTabsMS);
  }

  private async onCheckAllTabsLogic() {
    const currentAllWindows = await openWindows();
    const currentOpenTabs: string[] = currentAllWindows.map(
      (w) => w.owner.name
    );

    const now = new Date();
    const allTabCache = this.sessionHandler.getAllTabCache();
    for (const tabName of currentOpenTabs) {
      const existing = allTabCache.get(tabName);
      if (existing) {
        existing.lastSeen = now;
      } else {
        this.sessionHandler.setItemInAllTabCache(tabName, {
          tabName,
          firstSeen: now,
          lastSeen: now,
        });
      }
    }

    for (const [tabName, tab] of allTabCache) {
      if (!currentOpenTabs.includes(tabName)) {
        tab.lastSeen = now;
        this.sessionHandler.removeItemFromAllTabCache(tabName);
      }
    }
  }
}
