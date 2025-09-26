import { ipcMain } from "electron";
import {
  getActiveSessions,
  getCurrentActivity,
  GetActiveSessionsDateRange,
  getUsageStats,
  getSessionSnapshots,
} from "../database/database";

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
    ipcMain.handle(
      "get-history-activity",
      async (
        e,
        range: GetActiveSessionsDateRange,
        page: number,
        pageSize: number
      ) => {
        const data = getActiveSessions(range, page, pageSize);

        return data;
      }
    );
    ipcMain.handle("get-session-snapshots", async (e, sessionId: number) => {
      const data = getSessionSnapshots(sessionId);

      return data;
    });
  }
}
