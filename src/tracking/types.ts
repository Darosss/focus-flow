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
