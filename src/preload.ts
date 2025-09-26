// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import {
  CurrentActivityData,
  SessionSnapshot,
  TimeData,
} from "./tracking/types";
import {
  GetActiveSessionsDateRange,
  GetActiveSessionsReturn,
} from "./database/database";

contextBridge.exposeInMainWorld("trackerAPI", {
  getLastUsedApps: () => ipcRenderer.invoke("get-last-used-apps"),
  getCurrentActivity: () => ipcRenderer.invoke("get-current-activity"),
  getHistoryActivity: (
    range: GetActiveSessionsDateRange,
    page: number,
    pageSize?: number
  ) => ipcRenderer.invoke("get-history-activity", range, page, pageSize),
  getSessionSnapshots: (sessionId: number) =>
    ipcRenderer.invoke("get-session-snapshots", sessionId),
});

export type TrackerAPI = {
  getLastUsedApps: () => Promise<TimeData[]>;
  getCurrentActivity: () => Promise<CurrentActivityData | null>;
  getHistoryActivity: (
    range: GetActiveSessionsDateRange,
    page: number,
    pageSize?: number
  ) => Promise<GetActiveSessionsReturn>;
  getSessionSnapshots: (sessionId: number) => Promise<SessionSnapshot[]>;
};
