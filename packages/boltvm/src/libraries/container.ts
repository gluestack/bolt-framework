import os from "os";
import { join } from "path";
import chalk from "chalk";

import { exists } from "../helpers/fs-exists";
import { createFolder } from "../helpers/fs-mkdir";
import { copyFile } from "../helpers/fs-copyfile";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { removeFolder } from "../helpers/fs-remove-folder";

import { BOLTVM, VM_BINARIES } from "../constants/bolt-vm";

export default class Container {
  containerName: string;
  containersPath: string = join(
    os.homedir(),
    BOLTVM.METADATA_FOLDER,
    BOLTVM.CONTAINER_FOLDER
  );

  constructor(containerName: string) {
    this.containerName = containerName;
  }

  async createImage(cached: boolean) {
    if (!(await exists(this.containersPath))) {
      await createFolder(this.containersPath);
    }

    const projectContainerPath = join(
      this.containersPath,
      `${this.containerName}`
    );
    if (!(await exists(projectContainerPath))) {
      await createFolder(projectContainerPath);
    }

    if (!cached) {
      console.log(
        chalk.yellow(`>> Creating image for ${this.containerName}...`)
      );
      await copyFile(
        VM_BINARIES.ALPINE,
        projectContainerPath,
        VM_BINARIES.CONTAINER_IMAGE_NAME
      );
      console.log(chalk.green(`>> Image created for ${this.containerName}!`));
    }

    if (
      !(await exists(
        join(projectContainerPath, VM_BINARIES.CONTAINER_IMAGE_NAME)
      ))
    ) {
      console.log(
        chalk.yellow(
          `>> Image Not found! Creating image for ${this.containerName}...`
        )
      );
      await copyFile(
        VM_BINARIES.ALPINE,
        projectContainerPath,
        VM_BINARIES.CONTAINER_IMAGE_NAME
      );
      console.log(chalk.green(`>> Image created for ${this.containerName}!`));
    }

    return projectContainerPath;
  }

  async removeImage() {
    const projectContainerPath = join(
      this.containersPath,
      `${this.containerName}`
    );

    if (!(await exists(projectContainerPath))) {
      exitWithMsg(">> Container does not exist");
    }

    await removeFolder(projectContainerPath);
    console.log(chalk.green(`>> Container ${this.containerName} removed`));

    return true;
  }
}
