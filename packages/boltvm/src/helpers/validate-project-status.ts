import Common from "../common";
import { IMetadata, IProject } from "../typings/metadata";
import { IBoltVMConfig } from "../typings/boltvm-config";
import { exitWithMsg } from "./exit-with-msg";
import { getStore } from "./get-store";
import { IBolt } from "../typings/bolt";
import { BoltVmActions } from "../typings/boltvm-actions";

export const validateProjectStatus = async (
  action: BoltVmActions,
  boltConfig: IBolt
) => {
  const projectId = boltConfig.project_id;
  const projectName = boltConfig.project_name;
  const store = await getStore();
  const data: IProject = store.get("projects");
  let project: IMetadata = data[projectId];

  if (!project && boltConfig) {
    project = await Common.createProjectMetadata(boltConfig);
  }

  switch (action) {
    case "create":
      if (project && project.status === "up") {
        exitWithMsg(
          `>> "${projectName}"'s image has already been built and boltvm is running.`
        );
      }
      break;
    case "run":
      if (project && project.status === "down") {
        exitWithMsg(`>> boltvm is down!`);
      }
      break;
    case "down":
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectName}" project is already down or is not running`
        );
      }
      break;
    case "status":
      if (!project) {
        exitWithMsg(">> Project has not been created yet.");
      }
      break;
    case "exec":
      if (!project) {
        exitWithMsg(`>> No container exist for project id: "${projectName}"`);
      }
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectName}" is down, please run the project first!!!`
        );
      }
      break;
    case "log":
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectName}" project is already down or is not running`
        );
      }
      break;
    default:
      break;
  }

  return project;
};
