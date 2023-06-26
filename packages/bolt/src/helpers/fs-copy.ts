import { join } from "node:path";
import { copySync } from "fs-extra";
import * as fs from "fs/promises";

export async function copyFolder(sourceFolder: string, targetFolder: string) {
  copySync(sourceFolder, targetFolder);
}

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
