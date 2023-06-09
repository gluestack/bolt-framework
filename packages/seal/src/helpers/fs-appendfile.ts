import { appendFile } from "fs/promises";

export const appendfile = async (filepath: string, content: string = "") => {
  try {
    await appendFile(filepath, content);
  } catch (err) {
    return Promise.reject(err);
  }
  return Promise.resolve(true);
};
