import chalk from "chalk";
// import deploy from "../actions/deploy";

export default async (program: any) => {
  program
    .command("deploy")
    .option(
      "-a, --auth [true]",
      "Re-enter credentials, do not use presisted credentials from earlier",
      false
    )
    .description("Prepares the compressed project & initiates the deployment")
    .action((options: any) => {
      // deploy(options, true);
    });
};
