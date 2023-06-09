import { readFile } from "fs/promises";

export const readfile = async (filepath: string): Promise<any> => {
  try {
    const raw = await readFile(filepath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return false;
  }
};
