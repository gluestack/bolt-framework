const fs = require('fs-extra');

export async function copyFolder(sourceFolder: string, targetFolder: string) {
  await fs.copySync(sourceFolder, targetFolder);
}
