import { join } from "path";
import { find } from "lodash";
import {
  writeFile,
  getPrefix,
  getCrossEnvKey,
  jsonToEnv,
} from "@gluestack/helpers";

/**
 * Env
 *
 * This class is responsible for generating the .env file
 * in your gluestack app
 */
export default class Env {
  public keys: any;
  public keyCharacter: "%";
  public envs: ChildEnv[];
  public filepath: string;

  constructor(envContent: any, build: "prod" | "dev", routes: any = []) {
    this.keys = envContent;
    routes.map((route: any) => {
      const server = route.domain.split(".")[0] || "";
      if (!this.keys[`ENDPOINT_${server.toUpperCase()}`]) {
        this.keys[
          `ENDPOINT_${server.toUpperCase()}`
        ] = `http://localhost:${route.port}`;
      }
    });
    this.keyCharacter = "%";
    this.envs = [];
    this.filepath = join(process.cwd(), ".env");
  }

  // Adds router.js data to the nginx conf data
  // if and only if the given path exists
  public async addEnv(
    serviceName: string,
    envContent: any,
    path: string
  ): Promise<any> {
    for await (const key of Object.keys(envContent)) {
      this.keys[getCrossEnvKey(serviceName, key)] = envContent[key];
    }

    const childEnv = new ChildEnv(
      getPrefix(serviceName),
      serviceName,
      envContent,
      path
    );
    this.envs.push(childEnv);
  }

  // Generates the .env file
  public async generate(): Promise<void> {
    try {
      for (const key in this.keys) {
        const prefix = key.split("_")[0];
        const replaceKeys = this.getReplaceKeys(this.keys[key]);
        for (const replaceKey of replaceKeys) {
          this.keys[key] = this.keys[key].replaceAll(
            `${this.keyCharacter}${replaceKey}${this.keyCharacter}`,
            this.keys[replaceKey] || ""
          );
          const childEnv = find(this.envs, { prefix: prefix });
          if (childEnv) {
            childEnv.updateKey(
              key.replace(new RegExp("^" + `${prefix}_`), ""),
              this.keys[key]
            );
          }
        }
      }

      await this.writeEnv();
    } catch (err) {
      console.log(">> .env file creation failed due to following reasons -");
      console.log(err);
    }
  }

  public async writeEnv() {
    for (const childEnv of this.envs) {
      if (childEnv.filepath === this.filepath) {
        this.keys = { ...this.keys, ...childEnv.keys };
      } else {
        await childEnv.writeEnv();
      }
    }
    const env = jsonToEnv(this.keys);
    await writeFile(this.filepath, env);
  }

  private getReplaceKeys(str: string): string[] {
    if (!str.includes(this.keyCharacter)) {
      return [];
    }
    const specialChar = "%";
    let startIdx = str.indexOf(specialChar);
    let endIdx = str.indexOf(specialChar, startIdx + 1);

    const result: any = [];
    while (startIdx !== -1 && endIdx !== -1) {
      const substring = str.substring(startIdx + 1, endIdx);
      result.push(substring);

      const nextStartIdx = str.indexOf(specialChar, endIdx + 1);
      startIdx = endIdx;
      endIdx = nextStartIdx;
    }

    return result;
  }
}

class ChildEnv {
  public prefix: string;
  public serviceName: string;
  public keys: any;
  public filepath: string;

  constructor(prefix: string, serviceName: string, keys: any, path: string) {
    this.prefix = prefix;
    this.serviceName = serviceName;
    this.keys = keys;
    this.filepath = join(path, ".env");
  }

  public updateKey(key: string, value: string) {
    this.keys[key] = value;
  }

  public async writeEnv() {
    const env = jsonToEnv(this.keys);
    if (env) {
      await writeFile(this.filepath, env);
    }
  }
}
