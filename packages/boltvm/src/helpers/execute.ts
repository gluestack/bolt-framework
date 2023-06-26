import { spawn } from "node:child_process";

export const execute = (command: string, args: string[], options: any) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.on("exit", () => resolve("done"));

    child.on("close", (code) => {
      return code === 0 ? resolve("done") : reject("failed");
    });
  });
