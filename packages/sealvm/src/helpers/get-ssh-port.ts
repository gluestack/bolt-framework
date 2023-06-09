import { getStore } from "./get-store";

export const getSSHPort = async () => {
  const store = await getStore();
  const data = store.get("projects");
  let sshPort: number[] = [];

  for (let project in data) {
    if (data[project].sshPort) {
      sshPort.push(data[project].sshPort);
    }
  }

  if (sshPort.length !== 0) {
    sshPort.sort((a, b) => a - b);
    const port = sshPort[sshPort.length - 1] + 1;
    return port;
  }

  return 2222;
};
