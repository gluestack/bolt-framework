import { join } from "path";
import os from "os";

const homeDir = os.homedir();

export const SEALVM = {
  CONFIG_FILE: "sealvm.yml",
  METADATA_FOLDER: ".sealvm",
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
};

export const VM_INTERNALS_PATH = join(
  homeDir,
  SEALVM.METADATA_FOLDER,
  ".internals"
);

export const VM_BINARIES = {
  ALPINE: join(VM_INTERNALS_PATH, "alpine.img"),
  UEFI: join(VM_INTERNALS_PATH, "QEMU_EFI.img"),
  VARSTORE: join(VM_INTERNALS_PATH, "varstore.img"),
  NOTIFY_SCRIPT: join(VM_INTERNALS_PATH, "notify-from-host.sh"),
  IMAGE_NAME: "images.zip",
};

export const YAMLDATA = {
  destination: "/home/sealvm/projects",
  ports: ["3000:3000"],
  command: "seal up",
};

export const VM_CONFIG = {
  host: "127.0.0.1",
  port: 2222,
  username: "sealvm",
  password: "",
};

export const IMAGE_BUCKET_CONFIGS = {
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
};
