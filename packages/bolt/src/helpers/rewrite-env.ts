import { envToJson, jsonToEnv } from "@gluestack/helpers";
import { join } from "path";
import { writefile } from "./fs-writefile";

export const rewriteEnvViaRegExpression = async (
  servicePath: string,
  regularExpression: RegExp,
  value: string
) => {
  const regex = new RegExp(regularExpression, "g");

  const envTplLocaltion = join(servicePath, ".env.tpl");
  const envLocation = join(servicePath, ".env");

  const envTplContent = await envToJson(envTplLocaltion);
  let envContent = await envToJson(envLocation);

  for await (const key of Object.keys(envTplContent)) {
    if (envTplContent[key].match(regex)) {
      envContent[key] = envContent[key].replace("localhost", value);
    }
  }

  envContent = jsonToEnv(envContent);

  await writefile(envLocation, envContent);
};
