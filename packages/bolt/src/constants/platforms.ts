// readonly variable

export const hostServiceRunners = ["docker", "local"] as const;
export const supportedServiceRunners = [
  "local",
  "docker",
  "vmlocal",
  "vmdocker",
] as const;
