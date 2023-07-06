import { join } from "path";
import os from "os";

const homeDir = os.homedir();
export const BOLTVM = {
  METADATA_FOLDER: join(".bolt", "boltvm"),
  METADATA_FILE: "metadata.json",
  CONTAINER_FOLDER: "containers",
  SCRIPT_PATH: join(
    __dirname,
    "../../../../../",
    "assets",
    "internals",
    "scripts",
    "notify-from-host.sh"
  ),
  LOG_FOLDER: join(".logs", "vm"),
};

export const VM_INTERNALS_PATH = join(
  homeDir,
  BOLTVM.METADATA_FOLDER,
  ".internals"
);

export const VM_CONFIG = {
  host: "127.0.0.1",
  port: 2222,
  username: "root",
  password: "",
};

export const VM_BINARIES = {
  ALPINE: join(VM_INTERNALS_PATH, "alpine.img"),
  UEFI: join(VM_INTERNALS_PATH, "QEMU_EFI.img"),
  VARSTORE: join(VM_INTERNALS_PATH, "varstore.img"),
  NOTIFY_SCRIPT: join(VM_INTERNALS_PATH, "notify-from-host.sh"),
  IMAGE_NAME: "images.zip",
  CONTAINER_IMAGE_NAME: "alpine.img",
};

export const SSH_CONFIG = [
  "-o",
  "StrictHostKeyChecking=accept-new",
  "root@localhost",
];

export const IMAGE_BUCKET_CONFIGS = {
  cdnEndpoint:
    "http://static.gluestack.io/bolt/v0.1.0/qemu-images/apple-silicon/images.zip",
};

export const VM_INTERNALS_CONFIG = {
  destination: "/home/boltvm/projects",
  boltInstallationCommand: "sudo npm i -g @gluestack/bolt@latest",
  projectCdCommand: `cd /home/boltvm/projects`,
};
