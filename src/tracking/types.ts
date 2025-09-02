import { Result } from "get-windows";

export type ResultJSON = Result & {
  date: Date;
};

export type DataJSON = {
  date: {
    value: Date;
    data: {
      active: ResultJSON[];
      allWindows: ResultJSON[];
    };
  };
};
