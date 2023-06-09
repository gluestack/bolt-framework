import { IMetadata } from "../typings/metadata";
import { exitWithMsg } from "./exit-with-msg";
import { getStore } from "./get-store";

export const validateProjectStatus = async (
  projectName: string,
  command: string
) => {
  const store = await getStore();
  const data = store.get("projects");
  const project: IMetadata =
    data && data[projectName] ? data[projectName] : null;

  switch (command) {
    case "create":
      if (project && (project.status === "build" || project.status === "up")) {
        exitWithMsg(
          `>> "${projectName}"'s image has already been built and sealvm is running.`
        );
      }
      break;
    case "run":
      if (project && project.status === "down") {
        exitWithMsg(`>> sealvm is down, please create the project first!!!`);
      }
      if (project && project.status === "up") {
        exitWithMsg(`>> "${projectName}" is already running`);
      }
      break;
    case "down":
      if (project && project.status === "down") {
        exitWithMsg(
          `> "${projectName}" project is already down or is not running`
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
        exitWithMsg(`>> No container exist with name: "${projectName}"`);
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
          `> "${projectName}" project is already down or is not running`
        );
      }
      break;
    default:
      break;
  }

  return project;
};
