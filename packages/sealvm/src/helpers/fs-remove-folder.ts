import { rm } from "fs/promises";

export const removeFolder = async (filePath: string) => {
  try {
    await rm(filePath, { recursive: true });
    return Promise.resolve(true);
  } catch (err: any) {
    return Promise.reject(err);
  }
};
