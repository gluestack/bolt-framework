import { exists } from "./fs-exists";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { join } from "path";
import { createFolder } from "./fs-mkdir";
import * as fs from "fs";
import { writefile } from "./fs-writefile";

export const executeDetachedWithLogs = async (
  command: string,
  args: string[],
  logFileLocation: string,
  options: any,
  customMessage?: string,
  noMessage?: boolean
): Promise<number> => {
  if (!(await exists(logFileLocation))) {
    await createFolder(logFileLocation);
  }

  const outputLogPath: string = join(logFileLocation, "out.log");
  const errorLogPath: string = join(logFileLocation, "err.log");

  await writefile(outputLogPath, "");
  await writefile(errorLogPath, "");

  // Open a file to redirect standard output/error streams
  const stdOut: number = fs.openSync(outputLogPath, "a");
  const stdErr: number = fs.openSync(errorLogPath, "a");

  // Spawn the process in detached mode
  const child: ChildProcessWithoutNullStreams = spawn(command, args, {
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
    if (noMessage) {
      process.exit();
    }
    if (customMessage && customMessage === "Command Runner") {
      console.log(`>> (detached) ${customMessage} Error:`, err);
      process.exit();
    }
    console.log(">> (detached) Error:", err.message);
    process.exit();
  });

  // child.on("exit", (code: number, signal: string) => {
  //   if (noMessage) {
  //     process.exit();
  //   }
  //   if (customMessage) {
  //     console.log(
  //       `>> (detached) ${customMessage} Process exited with code:`,
  //       code
  //     );
  //   } else {
  //     console.log(">> (detached) Process exited with code:", code);
  //   }
  //   if (code !== 0) {
  //     process.exit();
  //   }
  // });

  return child.pid || 0;
};

export const executeDetached = async (
  command: string,
  args: string[],
  options: any,
  customMessage?: string
) => {
  // Spawn the process in detached mode
  const child = spawn(command, args, {
    ...options,
    detached: true,
    stdio: ["ignore", "ignore", "ignore"],
  });

  // Detach the child process
  child.unref();

  // Optionally, listen for events
  child.on("error", (err: any) => {
    if (customMessage) {
      console.log(`>> (detached) ${customMessage} Error:`, err);
      process.exit();
    }
    console.log(">> (detached) Error:", err.message);
    process.exit();
  });

  // child.on("exit", (code, _signal) => {
  //   if (customMessage) {
  //     console.log(`>> (detached) ${customMessage} process exited with code:`);
  //   } else {
  //     console.log(">> (detached) process exited with code:", code);
  //   }
  //   if (code !== 0) {
  //     process.exit();
  //   }
  // });

  return child.pid || 0;
};
