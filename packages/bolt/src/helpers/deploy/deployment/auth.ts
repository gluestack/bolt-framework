const inquirer = require("inquirer");
import axios from "axios";
import { BOX_SERVER_URL } from "../../../config";
import Store from "../../../libraries/store";
import { exitWithMsg } from "../../exit-with-msg";

export const auth = async (doAuth: boolean, store: Store) => {
  try {
    const creds = {
      access_key: store.get("access_key"),
      secret_key: store.get("secret_key"),
    };

    // prompts to collect credentials from users
    if (doAuth || !creds.access_key || !creds.secret_key) {
      const results = await inquirer.prompt([
        {
          name: "access_key",
          message: "Please enter your access key",
          type: "input",
        },
        {
          name: "secret_key",
          message: "Please enter your secret key",
          type: "input",
        },
      ]);

      creds.access_key = results.access_key;
      creds.secret_key = results.secret_key;

      // store credentials in the store
      store.set("access_key", results.access_key);
      store.set("secret_key", results.secret_key);
    }

    // authenticate user
    const { data } = await axios.request({
      method: "POST",
      url: `${BOX_SERVER_URL}/deployment/login`,
      data: JSON.stringify(creds),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.success) {
      await exitWithMsg("Error authenticating user");
    }

    //  check if user is blocker
    if (data.data?.user?.is_blocked) {
      await exitWithMsg("User is blocked");
    }

    const userData = data.data?.user;
    const projects = data.data?.user?.projects;
    // Delete projects from userData object without updating data.data.user.projects
    delete userData.projects;

    // remove projects from the userData object

    // store user details in the store
    store.set("user", userData || "");
    store.save();

    return {
      user: userData,
      projects: projects,
    };
  } catch (error: any) {
    await exitWithMsg("Error authenticating user");
  }
};
