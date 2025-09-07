import { Result } from "get-windows";

export type ResultJSON = Result & {
  date: Date;
};

export type DataJSON = {
  [index: string]: {
    active: ResultJSON[];
    allWindows: ResultJSON[];
  };
};

export type ActiveSession = {
  id: number;
  appName: string;
  platform: string;
  startTime: Date;
  endTime?: Date;
};

export type SessionSnapshot = {
  id: number;
  sessionId: number;
  snapshotTime: Date;
  title: string;
  memoryUsage: number;
};

export type AllTab = {
  id: number;
  tabName: string;
  firstSeen: Date;
  lastSeen?: Date;
};

export type SessionAllTabs = {
  tab_id: number;
  sessionId: number;
  tabName: string;
  firstOpened: Date;
  lastClosed?: Date;
};

export type TODO = any;
