import { mkdir } from "fs/promises";

export const createFolder = async (filepath: string) => {
  try {
    await mkdir(filepath, { recursive: true });
  } catch (err) {
    return Promise.reject(err);
  }
  return Promise.resolve(true);
};
