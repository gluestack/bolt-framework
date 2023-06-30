(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "./bolt-vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VM_BOOT = void 0;
    const path_1 = require("path");
    const bolt_vm_1 = require("./bolt-vm");
    const VM_BOOT = (containerPath, sshPort) => {
        const alpineImage = (0, path_1.join)(containerPath, "alpine.img");
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
            `if=pflash,format=raw,file=${bolt_vm_1.VM_BINARIES.UEFI}`,
            "-drive",
            `if=pflash,file=${bolt_vm_1.VM_BINARIES.VARSTORE}`,
            "-drive",
            `if=virtio,file=${alpineImage}`,
            "-netdev",
            `user,id=eth0,hostfwd=tcp::${sshPort}-:22`,
            "-device",
            "virtio-net-pci,netdev=eth0",
        ];
    };
    exports.VM_BOOT = VM_BOOT;
});
