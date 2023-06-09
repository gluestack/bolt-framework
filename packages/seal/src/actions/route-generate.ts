import generateRoutes from "../helpers/generate-routes";
import { getAndValidateSealYaml } from "./up";

export default async (): Promise<void> => {
  const _yamlContent = await getAndValidateSealYaml();

  console.log(`> Creating Ingress ${_yamlContent.project_name}...`);
  await generateRoutes(_yamlContent);
  process.exit(0);
};
