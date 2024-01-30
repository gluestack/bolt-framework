import { createReadStream, unlinkSync } from "fs";
import Store from "../../../libraries/store";
import { createDeployment } from "../apis/handlers/gql/create-deployment";
import axios from "axios";
import { BOX_SERVER_URL } from "../../../config";
const inquirer = require("inquirer");
import FormData from "form-data";
import { apiRequest } from "../apis/api-request";

export const upload = async (filepath: string, store: Store) => {
  // upload the project zip file to minio
  try {
    const form = new FormData();
    form.append("file", createReadStream(filepath));

    const { data } = await apiRequest({
      method: "POST",
      route: "/upload",
      data: form,
      headers: {
        ...form.getHeaders(),
      },
    });

    if (!data.success || !data.data || !data.data.id) {
      console.error("Error uploading the project zip file to minio");
      process.exit(1);
    }

    const fileId = data.data.id;
    unlinkSync(filepath);
    return fileId;
  } catch (error: any) {
    console.log(
      "> Uploading failed due to following reason:",
      error.message || error
    );
    console.log(error);
    process.exit(-1);
  }
};
