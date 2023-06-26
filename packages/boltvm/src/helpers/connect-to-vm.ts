import chalk from "chalk";
import { Client } from "ssh2";

import { VM_CONFIG } from "../constants";
import { exitWithMsg } from "./exit-with-msg";

export const connecToVm = async (portNumber: number = 2222) => {
  const interval = 5000;
  const maxDuration = 5 * 60 * 1000;
  const maxIterations = Math.floor(maxDuration / interval);

  let currentCounter = 0;
  let isReady: boolean = false;
  return new Promise((resolve, _reject) => {
    try {
      const pollConnection = setInterval(() => {
        currentCounter++;

        const conn = new Client();

        conn.connect({ ...VM_CONFIG, port: portNumber });

        conn.on("ready", () => {
          clearInterval(pollConnection);

          if (isReady) {
            return resolve(conn);
          }

          isReady = true;
          console.log(chalk.green(">> Successfully connected to VM..."));
          return resolve(conn);
        });

        conn.on("error", (err: any) => {});

        if (currentCounter >= maxIterations) {
          clearInterval(pollConnection);
          exitWithMsg(">> Maximum Tries exceeded!");
        }
      }, interval);
    } catch (error: any) {
      exitWithMsg(">> Error establishing connection", error);
    }
  });
};

export const connectToVmOnce = async (portNumber: number = 2222) => {
  return new Promise((resolve, _reject) => {
    try {
      const conn = new Client();

      conn.connect({ ...VM_CONFIG, port: portNumber });
      conn.on("ready", () => {
        return resolve(conn);
      });
      conn.on("error", (error: any) => {
        exitWithMsg(">> Error establishing connection", error);
      });
    } catch (error: any) {
      exitWithMsg(">> Error establishing connection", error);
    }
  });
};
