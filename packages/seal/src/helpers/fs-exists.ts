import { access } from "fs/promises";

export const exists = async (path: string): Promise<boolean | string> => {
  try {
    await access(path);
    return path;
  } catch (error) {
    return false;
  }
};
