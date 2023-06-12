import { SEALVM } from "../constants";
import os from "os";
import { join } from "path";
import { exists } from "../helpers/fs-exists";
import { createFolder } from "../helpers/fs-mkdir";
import { copyFile } from "../helpers/fs-copyfile";
import { VM_BINARIES } from "../constants";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { removeFolder } from "../helpers/fs-remove-folder";
import chalk from "chalk";
export default class Container {
  containerName: string;
  containersPath: string = join(
    os.homedir(),
    SEALVM.METADATA_FOLDER,
    SEALVM.CONTAINER_FOLDER
  );

  constructor(containerName: string) {
    this.containerName = containerName;
  }

  async createImage() {
    console.log(chalk.yellow(`>> Creating image for ${this.containerName}...`));
    if (!(await exists(this.containersPath))) {
      await createFolder(this.containersPath);
    }

    const projectContainerPath = join(
      this.containersPath,
      `${this.containerName}-image`
    );
    if (!(await exists(projectContainerPath))) {
      await createFolder(projectContainerPath);
    }

    if (!(await exists(join(projectContainerPath, VM_BINARIES.ALPINE)))) {
      await copyFile(VM_BINARIES.ALPINE, projectContainerPath, "alpine.img");
    }
    console.log(chalk.green(`>> Image created for ${this.containerName}!`));

    return projectContainerPath;
  }

  async removeImage() {
    const projectContainerPath = join(
      this.containersPath,
      `${this.containerName}-image`
    );

    if (!(await exists(projectContainerPath))) {
      exitWithMsg(">> Container does not exist");
    }

    await removeFolder(projectContainerPath);
    console.log(chalk.green(`>> Container ${this.containerName} removed`));

    return true;
  }
}
