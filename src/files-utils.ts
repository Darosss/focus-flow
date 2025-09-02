import { writeFile, readFile, mkdir } from "fs/promises";

import path from "path";

type UrlType = {
  absolute?: boolean;
  url: string;
  extension: string;
};

type CreateNotExistingPathUrl = Pick<UrlType, "absolute" | "url"> &
  Partial<UrlType>;

const defaultFileEncoding = "utf-8";
const baseDataFolder = path.resolve(__dirname, "data");
export const writeFileAsync = async (
  { absolute, url, extension }: UrlType,
  data: string
) => {
  const urlToSave = absolute
    ? url + extension
    : path.join(baseDataFolder, path.basename(url)) + extension;
  await writeFile(urlToSave, data, { encoding: defaultFileEncoding });
};

export const readFileAsync = async <T>({
  absolute,
  url,
  extension,
}: UrlType): Promise<T> => {
  const urlToSave = absolute
    ? url + extension
    : path.join(baseDataFolder, path.basename(url)) + extension || "";

  return (await readFile(urlToSave, {
    encoding: defaultFileEncoding,
  })) as unknown as T;
};

export const createNotExistingPath = async ({
  absolute,
  url,
  extension,
}: CreateNotExistingPathUrl) => {
  const urlToCreate = absolute
    ? url + extension || ""
    : path.join(baseDataFolder, path.basename(url)) + extension || "";

  try {
    await mkdir(urlToCreate, { recursive: true });
  } catch (err) {
    console.error(err);
  }
};

mkdir(baseDataFolder, { recursive: true });
