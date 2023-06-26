import fs from "fs/promises";
import { join } from "path";

export const copyFile = async (
  source: string,
  destination: string,
  fileName: string
) => {
  try {
    const destinationPath = join(destination, fileName);
    await fs.copyFile(source, destinationPath);
    return Promise.resolve(true);
  } catch (err: any) {
    return Promise.reject(err);
  }
};
