(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boltFile = void 0;
    exports.boltFile = {
        envfile: ".env.tpl",
        project_id: "",
        project_name: "",
        default_project_runner: "host",
        default_service_runner: "local",
        services: {},
        ingress: null,
        // server: {
        //   host: {
        //     command: "node glue up",
        //   },
        //   vm: {
        //     name: "",
        //     source: "",
        //     destination: "/home/boltvm/projects",
        //     ports: ["3000:3000"],
        //     command: "node glue up",
        //   },
        // },
    };
});
