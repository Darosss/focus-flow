import { Result } from "get-windows";
import {
  addOrUpdateGlobalTab,
  addOrUpdateSessionTab,
  addSnapshotsBatch,
  endSession,
  startSession,
} from "../database/database";
import { SessionSnapshot, AllTab, ActiveSession } from "./types";

type CurrentSessionData = {
  appName: ActiveSession["appName"];
  id: number;
};

export class ActivityTrackerSessionHandler {
  private sessionSnapshotCache: Omit<SessionSnapshot, "id">[] = [];
  private allTabCache = new Map<string, Omit<AllTab, "id">>();
  private currentSessionData: CurrentSessionData | null = null;

  public getCurrentSessionData() {
    return this.currentSessionData;
  }

  public getSessionSnapshotCache() {
    return this.sessionSnapshotCache;
  }

  public getAllTabCache() {
    return this.allTabCache;
  }

  public setItemInAllTabCache(key: string, value: Omit<AllTab, "id">) {
    this.allTabCache.set(key, value);
  }

  public removeItemFromAllTabCache(key: string) {
    this.allTabCache.delete(key);
  }

  public pushToSessionSnapshotCache(items: Omit<SessionSnapshot, "id">[]) {
    this.sessionSnapshotCache.push(...items);
  }

  private saveCacheSnapshots() {
    if (!this.currentSessionData) {
      return console.warn(
        "Trying to add snapshot, tho the currentSessionData is null"
      );
    }

    if (!this.sessionSnapshotCache.length) return;

    addSnapshotsBatch(this.sessionSnapshotCache);
  }

  public startNewSession(data: Result, date: Date) {
    if (this.currentSessionData) {
      this.endCurrentSession(date);
    }

    const sessionId = startSession(data.owner.name, data.platform, date);
    this.currentSessionData = {
      id: sessionId,
      appName: data.owner.name,
    };
  }

  private endCurrentSession(date: Date) {
    if (!this.currentSessionData) {
      return console.warn(
        "Trying to end current session snapshot, tho the currentSessionData is null"
      );
    }
    endSession(this.currentSessionData.id, date);

    this.currentSessionData = null;
  }

  private updateAllTabs() {
    const now = new Date();
    for (const value of this.allTabCache.values()) {
      addOrUpdateGlobalTab(value.tabName, now);

      if (this.currentSessionData?.id) {
        addOrUpdateSessionTab(this.currentSessionData.id, value.tabName, now);
      }
    }
  }

  private async clearCurrentDataCache() {
    this.sessionSnapshotCache = [];
  }

  public updateCurrentData() {
    try {
      this.saveCacheSnapshots();
      this.updateAllTabs();
      this.clearCurrentDataCache();
    } catch (err) {
      console.error(err);
    }
  }
}
