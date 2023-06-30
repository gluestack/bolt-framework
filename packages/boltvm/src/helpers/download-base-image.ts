import progress from "progress-stream";
import { createWriteStream } from "fs";
import chalk from "chalk";
import { join } from "path";
import axios from "axios";

import {
  IMAGE_BUCKET_CONFIGS,
  VM_BINARIES,
  VM_INTERNALS_PATH,
} from "../constants/bolt-vm";

import { exitWithMsg } from "./exit-with-msg";

export const downloadBaseImages = async () => {
  // Downloads your file and saves its contents to /tmp/local-file.ext.

  try {
    const response = await axios({
      method: "get",
      url: IMAGE_BUCKET_CONFIGS.cdnEndpoint,
      responseType: "stream",
    });
    // const contentLength = response.ContentLength;

    const progressStream = progress({
      length: response.headers["content-length"],
      time: 1000, // Emit progress event every second
    });

    // Create a write stream to save the file locally
    const fileStream = createWriteStream(
      join(VM_INTERNALS_PATH, VM_BINARIES.IMAGE_NAME)
    );

    // Listen to progress events
    progressStream.on("progress", (progress) => {
      let transferredSize;
      let lengthSize;

      const percent = Math.round(progress.percentage);

      if (progress.transferred >= 1024 * 1024 * 1000) {
        transferredSize = `${(
          progress.transferred /
          (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;
        lengthSize = `${(progress.length / (1024 * 1024 * 1024)).toFixed(
          2
        )} GB`;
      } else {
        transferredSize = `${(progress.transferred / (1024 * 1024)).toFixed(
          2
        )} MB`;
        lengthSize = `${(progress.length / (1024 * 1024)).toFixed(2)} MB`;
      }

      process.stdout.clearLine(1);
      process.stdout.cursorTo(0);
      process.stdout.write(
        chalk.yellow(
          `\r>> Downloaded: ${transferredSize} / ${lengthSize} - ${percent}%`
        )
      );
    });

    if (response.data) {
      // Pipe the response body to the progress stream and then to the file stream
      response.data.pipe(progressStream).pipe(fileStream);
    }

    // Wait for the file to be downloaded and saved
    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", (err) => {
        exitWithMsg("Something went wrong while downloading base images");
      });
    });
  } catch (err) {
    console.log("Error", err);
  }
};
