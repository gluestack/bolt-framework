import treekill from "tree-kill";
import { exitWithMsg } from "./exit-with-msg";

export const killProcess = (processId: number) => {
  treekill(processId, "SIGTERM", (err) => {
    if (err) {
      exitWithMsg(">> Error killing process:" + err.message);
    }
  });
  return Promise.resolve(true);
};

export const killMultipleProcesses = async (processIds: (number | null)[]) => {
  const killProcessPromises: any[] = [];
  for (const pid of processIds) {
    if (pid) killProcessPromises.push(killProcess(pid));
  }

  return await Promise.all(killProcessPromises);
};
