import { exitWithMsg } from "../../exit-with-msg";
import { getStoreData } from "../../get-store-data";
import { apiRequest } from "../apis/api-request";

const inquirer = require("inquirer");

export const setProject = async (projects: any[]) => {
  try {
    const choices: any = [{ name: "Create a new Project", value: "create" }];
    if (projects.length) {
      choices.push({ name: "Select a project", value: "select" });
    }

    const user = await getStoreData("user");

    if (!user.id) {
      await exitWithMsg("Error setting action for project Creation!");
    }

    const result = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Please choose an existing project or create one",
        choices: choices,
      },
    ]);

    if (!result || !result.action) {
      await exitWithMsg("Error setting action for project Creation!");
      return;
    }
    switch (result.action) {
      case "create":
        const createPrompt = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Please enter a name for the project",
          },
        ]);

        const body = {
          project_name: createPrompt.name,
          created_by: user.id,
        };

        const { data } = await apiRequest({
          method: "POST",
          data: body,
          route: "/projects",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!data || !data.success || !data.data.project) {
          console.log({ data });
          await exitWithMsg("Error creating project!");
        }
        const project = data.data.project;
        delete project.user;
        return project;
        break;
      case "select":
        const choices = projects.map((project: any) => {
          return { name: project.name, value: project };
        });
        const selectPrompt = await inquirer.prompt([
          {
            type: "list",
            name: "selectedProject",
            message: "Please choose an existing project or create one",
            choices: choices,
          },
        ]);
        return selectPrompt.selectedProject;
        break;
      default:
        await exitWithMsg("Error setting action for project Creation!");
    }
    return result;
  } catch (error: any) {
    console.log({ error: error.response.data || "nothing" });
    await exitWithMsg("Error While Project Selection!");
  }
};
