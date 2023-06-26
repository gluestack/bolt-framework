import { writeFile } from "fs/promises";

export const writefile = async (filepath: string, content: string = "") => {
  try {
    await writeFile(filepath, content);
  } catch (err) {
    return Promise.reject(err);
  }
  return Promise.resolve(true);
};
