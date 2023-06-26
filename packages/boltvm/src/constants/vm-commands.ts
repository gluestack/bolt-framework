import { join } from "path";
import { VM_BINARIES } from ".";

export const VM_BOOT = (containerPath: string, sshPort: number | string) => {
  const alpineImage = join(containerPath, "alpine.img");
  sshPort = sshPort.toString();
  return [
    "-cpu",
    "max",
    "-smp",
    "4",
    "-accel",
    "hvf",
    "-M",
    "virt",
    "-m",
    "4G",
    "-nographic",
    "-drive",
    `if=pflash,format=raw,file=${VM_BINARIES.UEFI}`,
    "-drive",
    `if=pflash,file=${VM_BINARIES.VARSTORE}`,
    "-drive",
    `if=virtio,file=${alpineImage}`,
    "-netdev",
    `user,id=eth0,hostfwd=tcp::${sshPort}-:22`,
    "-device",
    "virtio-net-pci,netdev=eth0",
  ];
};
