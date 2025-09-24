// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { CurrentActivityData, TimeData } from "./tracking/types";

contextBridge.exposeInMainWorld("trackerAPI", {
  getLastUsedApps: () => ipcRenderer.invoke("get-last-used-apps"),
  getCurrentActivity: () => ipcRenderer.invoke("get-current-activity"),
});

export type TrackerAPI = {
  getLastUsedApps: () => Promise<TimeData[]>;
  getCurrentActivity: () => Promise<CurrentActivityData | null>;
};
