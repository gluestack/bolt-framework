import chalk from "chalk";
import EnvGenerate from "../../actions/env-generate";
import { exitWithMsg } from "../../helpers/exit-with-msg";
import { validateMetadata } from "../../helpers/validate-metadata";
import { validateServices } from "../../helpers/validate-services";
import RouteGenerate from "../route-generate";
import DeployClass from "./deploy";

export default async (options: any, isWatch: boolean = false) => {
  // validate the project
  console.log(">> Validating project...");
  await validateMetadata();
  await validateServices();

  console.log(chalk.gray(">> Building Production Envs..."));
  const envGenerate = new EnvGenerate();
  await envGenerate.handle({ environment: "production" });
  console.log(chalk.green(">> Production Envs built successfully!") + "\n");

  const routeGenerate = new RouteGenerate();
  await routeGenerate.handle(true);

  console.log(
    "\n>> Note: Please remove any zip file or unnecessary files/folders from your project before deploying!"
  );
  console.log("\n>> Deploying project...");

  const deploy = new DeployClass();

  console.log("\n>> Gathering all deployable services...");

  // populate store
  await deploy.setStore();

  // populate services
  await deploy.setServices();

  // Showcase the services that are going to be deployed
  console.log(">> Found %d deployable services...\n", deploy.services.length);
  if (!deploy.services.length) {
    console.log(">> No services found! Please run glue build and try again!");
    process.exit(1);
  }

  // Create project's zip file
  console.log(">> Compressing the project...");
  await deploy.createZip();

  // authenticate the user & store creds in local store
  console.log("\n>> Authenticating user credentials...");
  const authData = await deploy.auth(options.auth);
  console.log(">> Authentication successful!\n");

  const projects = authData?.projects || [];
  const selectedProject = await deploy.setProject(projects);

  // uploads the project zip file to minio
  console.log(">> Uploading project zip file...");
  const fileId = await deploy.upload();
  console.log(">> Project zip file uploaded successfully!\n");

  console.log(">> Submitting the deployment now...");
  const deployment = await deploy.submit({
    fileId,
    projectId: selectedProject.id,
    userId: authData?.user?.id,
  });
  console.log(">> Deployment submitted successfully!\n");

  // // save store
  // await deploy.saveStore();

  // if (isWatch) {
  //   console.log(">> Fetching deployment details...\n");
  // await deploy.watch();
  // }
};
