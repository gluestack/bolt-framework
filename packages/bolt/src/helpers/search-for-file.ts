import { readdirSync, statSync } from "fs";
import { join } from "path";

export default function searchForFile(
  rootPath: string,
  fileName: string,
): string | undefined {
  try {
    const files = readdirSync(rootPath);
    for (const file of files) {
      try {
        const filePath = join(rootPath, file);

        if (statSync(filePath).isDirectory()) {
          const result = searchForFile(filePath, fileName);
          if (result) {
            return result;
          }
        } else if (file === fileName) {
          return filePath;
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
