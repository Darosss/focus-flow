import { ipcMain } from "electron";
import { getCurrentActivity, getUsageStats } from "../database/database";

export class IpcMainHandler {
  constructor() {
    this.initEvents();
  }

  private initEvents() {
    ipcMain.handle("get-last-used-apps", async () => {
      const data = getUsageStats();
      return data;
    });

    ipcMain.handle("get-current-activity", async () => {
      const data = getCurrentActivity();
      return data;
    });
  }
}
