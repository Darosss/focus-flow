import { activeWindow, openWindows } from "get-windows";
import { DataSaver } from "./data-saver";
import { ResultJSON } from "./types";

export class ActivityTracker {
  private dataSaver: DataSaver;
  private checkingActiveTabMS = 2000;
  private checkingAllTabsMS = 30000;
  private savingTimeMS = 32500;

  private activeTabCache: ResultJSON[] = [];
  private allTabCache: ResultJSON[] = [];

  private checkingActiveTabsInterval: NodeJS.Timeout | null = null;
  private checkingAllTabsInterval: NodeJS.Timeout | null = null;

  private savingDataInterval: NodeJS.Timeout | null = null;

  constructor(dataSaver: DataSaver) {
    this.dataSaver = dataSaver;
  }

  async startTracking() {
    this.startTrackingActiveTab();
    this.startTrackingAllTabs();

    this.startSaveInterval();
  }

  private startSaveInterval() {
    if (this.savingDataInterval)
      return console.log(
        "Trying to start tracking active tab, tho the interval is already on"
      );

    this.savingDataInterval = setInterval(async () => {
      this.saveCurrentData();
    }, this.savingTimeMS);
  }

  public async saveCurrentData() {
    try {
      await this.dataSaver.updateData({
        [`${new Date().toISOString()}`]: {
          active: this.activeTabCache,
          allWindows: this.allTabCache,
        },
      });
      this.clearCurrentDataCache();
    } catch (err) {
      console.error(err);
    }
  }

  private async clearCurrentDataCache() {
    this.allTabCache = [];
    this.activeTabCache = [];
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
  private async onCheckActiveTabLogic() {
    const currentActiveWindow = await activeWindow();
    this.activeTabCache.push({
      ...currentActiveWindow,
      date: new Date(),
    });
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
    const currentAllWindow = await openWindows();
    const currentDate = new Date();

    this.allTabCache.push(
      ...currentAllWindow.map((window) => ({ ...window, date: currentDate }))
    );
  }
}
