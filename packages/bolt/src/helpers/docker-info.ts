import { spawn } from "child_process";
import { join } from "path";
import os from "os";
import { writefile } from "./fs-writefile";
import { BOLT } from "../constants/bolt-configs";

const getDockerInfo = async () => {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", ["info"]);

    child.stderr.on("data", (data: any) => {
      console.log(data.toString());
    });

    child.on("exit", (code: number) => {
      code === 0 ? resolve(true) : resolve(false);
    });
  });
};

const updateDockerInfo = async (filePath: string) => {
  const dockerStatus = await getDockerInfo();

  const data = JSON.stringify({
    running: dockerStatus,
    lastUpdated: Date.now(),
  });

  await writefile(filePath, data);

  return dockerStatus;
};

export const getDockerStatus = async () => {
  const dockerInfoPath = join(
    os.homedir(),
    BOLT.PROCESS_FOLDER_NAME,
    "docker-info.json"
  );

  const status = await updateDockerInfo(dockerInfoPath);

  return status;
};
