import { exists } from "./fs-exists";
import { spawn } from "child_process";
import { basename, join } from "path";
import { createFolder } from "./fs-mkdir";
import * as fs from "fs";
import { writefile } from "./fs-writefile";

export const executeDetached = async (
  command: string,
  args: string[],
  servicePath: string,
  options: any,
  serviceName?: string
) => {
  let serviceLogPath = join(".logs", basename(servicePath));
  if (serviceName) {
    serviceLogPath = join(".logs", serviceName);
  }

  if (!(await exists(serviceLogPath))) {
    await createFolder(serviceLogPath);
  }

  const outputLogPath = join(serviceLogPath, "out.log");
  const errorLogPath = join(serviceLogPath, "err.log");

  await writefile(outputLogPath, "");
  await writefile(errorLogPath, "");

  // Open a file to redirect standard output/error streams
  const stdOut = fs.openSync(outputLogPath, "a");
  const stdErr = fs.openSync(errorLogPath, "a");

  // Spawn the process in detached mode
  const child = spawn(command, args, {
    ...options,
    detached: true,
    stdio: ["ignore", stdOut, stdErr],
  });

  // Detach the child process
  child.unref();

  fs.closeSync(stdOut);
  fs.closeSync(stdErr);

  // Optionally, listen for events
  child.on("error", (err: any) => {
    console.log(">> (detached) Error:", err.message);
    process.exit();
  });

  child.on("exit", (code, signal) => {
    console.log(">> (detached) Process exited with code:", code);
  });

  return child.pid;
};
