import { Client } from "ssh2";
import Down from "../actions/down";
import { VM_CONFIG } from "../constants/bolt-vm";
import { exitWithMsg } from "./exit-with-msg";

export const runCommandInVM = async (
  command: string,
  args: string[],
  portNumber: number,
  count: number = 0
) => {
  const interval = 5000;
  const maxDuration = 2 * 60 * 1000;
  const maxIterations = Math.floor(maxDuration / interval);

  let currentCounter = 0;
  return new Promise((resolve, _reject) => {
    try {
      const pollConnection = setInterval(() => {
        currentCounter++;

        const conn = new Client();

        conn.connect({ ...VM_CONFIG, port: portNumber });

        conn.on("ready", () => {
          clearInterval(pollConnection);

          conn.exec(`${command} ${args.join(" ")}`, {}, (err, stream) => {
            if (err) throw err;
            stream
              .on("close", (code: any, signal: any) => {
                // console.log(">> Successfully installed @gluestack/bolt@latest");
                conn.end();
                return resolve(conn);
              })
              .on("data", (data: any) => {
                // console.log(">> stdout:", data.toString());
              })
              .stderr.on("data", (data: any) => {
                // console.log(">> stderr:", data.toString());
              });
          });
        });

        conn.on("error", (err: any) => {});

        if (currentCounter >= maxIterations) {
          clearInterval(pollConnection);
          exitWithMsg(">> Maximum retries exceeded! Could not prepare VM.");
          const downVm = new Down();
          downVm.handle(process.cwd());
        }
      }, interval);
    } catch (error: any) {
      exitWithMsg(">> Error establishing connection", error);
    }
  });
};
