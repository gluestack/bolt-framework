import { readFile } from "fs/promises";

export const readfile = async (filepath: string): Promise<any> => {
  try {
    return await readFile(filepath, "utf8");
  } catch (e) {
    return false;
  }
};
