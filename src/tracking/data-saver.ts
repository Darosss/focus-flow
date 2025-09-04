import { directoryExist, readFileAsync, writeFileAsync } from "../files-utils";
import { DataJSON } from "./types";

type GetFileNameByDate = { year: number; month: number; day: number };

export class DataSaver {
  private readonly dataFileName = "../data";
  private readonly fileExtension = ".json";
  constructor() {}

  public async init() {
    await this.ensureDirectoryExist();
  }

  private getTodayFileName() {
    const todayDate = new Date();

    return this.getFileNameByDate({
      year: todayDate.getFullYear(),
      month: todayDate.getMonth(),
      day: todayDate.getDay(),
    });
  }
  private getFileNameByDate(date: GetFileNameByDate) {
    return `${this.dataFileName}-` + `${date.year}-${date.month}-${date.day}`;
  }

  private async ensureDirectoryExist() {
    const fileOpts = {
      url: this.getTodayFileName(),
      extension: this.fileExtension,
    };
    if (await directoryExist(fileOpts)) return;

    await writeFileAsync(fileOpts, "{}");
  }
  public async updateData(data: DataJSON) {
    try {
      const previousData = await this.readData();

      await writeFileAsync(
        { url: this.getTodayFileName(), extension: this.fileExtension },
        JSON.stringify({ ...previousData, ...data })
      );
    } catch (err) {
      return console.error("Couldnt save the data", err);
    }
  }

  public async readData() {
    const data = await readFileAsync<string>({
      url: this.getTodayFileName(),
      extension: this.fileExtension,
    });

    return JSON.parse(data) as DataJSON;
  }
}
