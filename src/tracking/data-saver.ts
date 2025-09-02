import { readFileAsync, writeFileAsync } from "../files-utils";
import { DataJSON } from "./types";

export class DataSaver {
  private readonly dataFileName = "../data";
  private readonly fileExtension = ".json";
  constructor() {}

  public async init() {
    await this.ensureDirectoryExist();
  }

  private async ensureDirectoryExist() {
    // await createNotExistingPath({ url: this.dataFileName });
    await writeFileAsync(
      { url: this.dataFileName, extension: this.fileExtension },
      "{}"
    );
  }
  public async updateData(newData: DataJSON) {
    try {
      const previousData = await this.readData();
      await writeFileAsync(
        { url: this.dataFileName, extension: this.fileExtension },
        JSON.stringify({ ...previousData, newData })
      );
    } catch (err) {
      return console.error("Couldnt save the data", err);
    }
  }

  public async readData() {
    const data = await readFileAsync<string>({
      url: this.dataFileName,
      extension: this.fileExtension,
    });

    return JSON.parse(data) as DataJSON;
  }
}
