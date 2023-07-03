import { join } from "path";
import chalk from "chalk";
import AdmZip from "adm-zip";

import { executeDetached } from "../helpers/execute-detached";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { getSSHPort } from "../helpers/get-ssh-port";
import { removeFolder } from "../helpers/fs-remove-folder";
import { createFolder } from "../helpers/fs-mkdir";
import { downloadBaseImages } from "../helpers/download-base-image";
import { removefile } from "../helpers/fs-removefile";
import { validateProjectStatus } from "../helpers/validate-project-status";
import { execute } from "../helpers/execute";

import { IMetadata } from "../typings/metadata";

import Container from "../libraries/container";

import VM from "../runners/vm";

import {
  VM_BINARIES,
  VM_INTERNALS_CONFIG,
  VM_INTERNALS_PATH,
} from "../constants/bolt-vm";

export default class Create {
  private async extractDownloadedImage() {
    const imagePath = join(VM_INTERNALS_PATH, VM_BINARIES.IMAGE_NAME);

    // Create an instance of AdmZip
    const zip = new AdmZip(imagePath);

    // Extract all files to a specified directory
    zip.extractAllTo(VM_INTERNALS_PATH, true, true);

    // Remove downloaded zip file
    await removefile(imagePath);
  }

  private async checkForBaseImages() {
    const alpineImage = VM_BINARIES.ALPINE;
    const varstoreImage = VM_BINARIES.VARSTORE;
    const uefiImage = VM_BINARIES.UEFI;
    const notifyScript = VM_BINARIES.NOTIFY_SCRIPT;

    // Check if images are already downloaded
    if (
      (await exists(alpineImage)) &&
      (await exists(varstoreImage)) &&
      (await exists(uefiImage)) &&
      (await exists(notifyScript))
    ) {
      return;
    }

    console.log(chalk.yellow(">> Binaries not found or are corrupted!"));

    // Remove .internals folder if exists
    if (await exists(VM_INTERNALS_PATH)) {
      console.log(chalk.yellow(">> Removing corrupted binaries..."));
      await removeFolder(VM_INTERNALS_PATH);
      console.log(chalk.green(">> Removed corrupted binaries successfully!"));
    }

    // Create .internals folder  folder
    await createFolder(VM_INTERNALS_PATH);

    // Download and extract base images
    console.log(chalk.yellow(">> Downloading binaries..."));
    await downloadBaseImages();
    console.log(chalk.green("\n>> Downloaded binaries successfully!"));

    console.log(chalk.yellow(">> Extracting downloaded binaries..."));
    await this.extractDownloadedImage();
    console.log(chalk.green(">> Binaries extracted successfully!"));
  }

  public async handle(localPath: string, cache: boolean) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        await exitWithMsg(">> Please specify correct path in source!");
        return;
      }

      // Check for base images
      await this.checkForBaseImages();

      // Make notify script executable
      await execute("chmod", ["+x", join(VM_BINARIES.NOTIFY_SCRIPT)], {});

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { project_id, project_name, vm } = boltConfig;
      // Check if image is already built
      const project = await validateProjectStatus("create", boltConfig);

      // Getting ssh port
      const sshPort = await getSSHPort();

      // Create Images for the project
      const container = new Container(`${project_id}_${project_name}`);
      const contianerPath = await container.createImage(cache);

      // Boot up VM
      const vmPid = await VM.create(localPath, contianerPath, sshPort);

      // Connect to VM
      const conn = await VM.connect(sshPort);
      await conn.end();

      // Copy files to VM and maintain it with rsync
      const args = [
        localPath,
        VM_INTERNALS_CONFIG.destination,
        sshPort.toString(),
      ];
      const mountPid = await executeDetached(
        VM_BINARIES.NOTIFY_SCRIPT,
        args,
        {
          detatched: true,
        },
        "mount"
      );

      // Adding project to metadata
      const json: IMetadata = {
        ...project,
        containerPath: contianerPath,
        sshPort: sshPort,
        status: "build",
        vmProcessId: vmPid,
        mountProcessId: mountPid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await updateStore("projects", project_id, json);
    } catch (error: any) {
      await exitWithMsg(`>> Error while creating : ${error.message}`);
    }
  }
}
