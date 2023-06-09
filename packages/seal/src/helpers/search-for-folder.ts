import { join } from "path";
import { readdirSync, statSync } from "fs";

export default function searchForFolder(
  rootPath: string,
  folderName: string,
): string | undefined {
  try {
    const files = readdirSync(rootPath);
    for (const file of files) {
      try {
        const filePath = join(rootPath, file);

        if (statSync(filePath).isDirectory()) {
          if (file === folderName) {
            return filePath;
          }
          const result = searchForFolder(filePath, folderName);
          if (result) {
            return result;
          }
        }
      } catch (e) {
        //
      }
    }
  } catch (e) {
    //
  }

  return undefined;
}
