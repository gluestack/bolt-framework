import { createProject } from "../actions/addMetadata";
import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";
import { exitWithMsg } from "./exit-with-msg";
import { getStore } from "./get-store";

export const validateProjectStatus = async (
  projectId: string,
  command: string,
  sealConfig?: ISealVMConfig
) => {
  const store = await getStore();
  const data = store.get("projects");
  let project: IMetadata = data && data[projectId] ? data[projectId] : null;

  if (!project && sealConfig) {
    project = await createProject(sealConfig);
  }

  switch (command) {
    case "create":
      if (project && (project.status === "build" || project.status === "up")) {
        exitWithMsg(
          `>> "${projectId}"'s image has already been built and sealvm is running.`
        );
      }
      break;
    case "run":
      if (project && project.status === "down") {
        exitWithMsg(`>> sealvm is down, please create the project first!!!`);
      }
      if (project && project.status === "up") {
        exitWithMsg(`>> "${projectId}" is already running`);
      }
      break;
    case "down":
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectId}" project is already down or is not running`
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
        exitWithMsg(`>> No container exist for project id: "${projectId}"`);
      }
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectId}" is down, please run the project first!!!`
        );
      }
      break;
    case "log":
      if (project && project.status === "down") {
        exitWithMsg(
          `>> "${projectId}" project is already down or is not running`
        );
      }
      break;
    default:
      break;
  }

  return project;
};
