import { join } from "path";
import chalk from "chalk";
import AdmZip from "adm-zip";

import { executeDetached } from "../helpers/execute-detached";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { validateSealFile } from "../helpers/validate-seal-file";
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

import { VM_BINARIES, VM_INTERNALS_PATH } from "../constants";

async function extractDownloadedImage() {
  const imagePath = join(VM_INTERNALS_PATH, VM_BINARIES.IMAGE_NAME);

  // Create an instance of AdmZip
  const zip = new AdmZip(imagePath);

  // Extract all files to a specified directory
  zip.extractAllTo(VM_INTERNALS_PATH, true, true);

  // Remove downloaded zip file
  await removefile(imagePath);
  return;
}

async function checkForBaseImages() {
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

  console.log(chalk.yellow(">> Binaries not found or corrupted !!!\n"));

  // Remove .internals folder if exists
  if (await exists(VM_INTERNALS_PATH)) {
    await removeFolder(VM_INTERNALS_PATH);
  }
  // Create .internals folder  folder
  await createFolder(VM_INTERNALS_PATH);

  // Download and extract base images
  console.log(chalk.yellow(">> Downloading Binaries..."));
  await downloadBaseImages();
  console.log(chalk.green("\n>> Binaries Downloaded successfully!\n"));

  console.log(chalk.yellow(">> Extracting downloaded binaries..."));
  await extractDownloadedImage();
  console.log(chalk.green(">> Binaries extracted successfully! \n"));

  return;
}

export default async (localPath: string) => {
  try {
    localPath =
      localPath === "." ? process.cwd() : join(process.cwd(), localPath);

    // Check for file path exists or not
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path to initialize");
      return;
    }

    // Check for base images
    await checkForBaseImages();

    await execute("chmod", ["+x", join(VM_BINARIES.NOTIFY_SCRIPT)], {});

    // Check for valid sealvm yml file
    const sealConfig = await validateSealFile(localPath);

    // Check if image is already built
    const project = await validateProjectStatus(sealConfig.name, "create");

    // Getting ssh port
    const sshPort = await getSSHPort();

    // Create Images for the project
    const container = new Container(sealConfig.name);
    const contianerPath = await container.createImage();

    // Boot up VM
    const vmPid = await VM.create(localPath, contianerPath, sshPort);

    // Connect to VM
    const conn = await VM.connect();

    await conn.end();

    // Copy files to VM and maintain it with rsync
    const args = [localPath, sealConfig.destination];
    const mountPid = await executeDetached(VM_BINARIES.NOTIFY_SCRIPT, args, {
      detatched: true,
    });

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

    await updateStore("projects", sealConfig.name, json);
  } catch (err: any) {
    console.log(err);

    exitWithMsg(">> Error while creating : ", err.message);
  }
};
