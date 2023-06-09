
import DeployClass from "./deploy";

export default async (
  options: any,
  isWatch: boolean = false,
) => {
  console.log('\n> Note: Please remove any zip file or unnecessary files/folders from your project before deploying!');
  console.log('\n> Deploying project...');

  const deploy = new DeployClass();

  console.log('\n> Gathering all deployable services...');

  // populate store
  await deploy.setStore();

  // populate services
  await deploy.setServices();

  // Showcase the services that are going to be deployed
  console.log('> Found %d deployable services...\n', deploy.services.length);
  if (!deploy.services.length) {
    console.log('> No services found! Please run glue build and try again!');
    process.exit(1);
  }

  // Create project's zip file
  console.log('> Compressing the project...');
  await deploy.createZip();

  // authenticate the user & store creds in local store
  console.log('\n> Authenticating user credentials...');
  await deploy.auth(options.auth);
  console.log('> Authentication successful!\n');

  // uploads the project zip file to minio
  console.log('> Uploading project zip file...');
  await deploy.upload();
  console.log('> Project zip file uploaded successfully!\n');

  // save store
  await deploy.saveStore();

  if (isWatch) {
    console.log("> Fetching deployment details...\n");
    await deploy.watch();
  }
};
