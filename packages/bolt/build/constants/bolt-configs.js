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
    exports.BOLT = void 0;
    exports.BOLT = {
        YAML_FILE_NAME: "bolt.yaml",
        SERVICE_YAML_FILE_NAME: "bolt.service.yaml",
        PROCESS_PROJECT_LIST_FILE_NAME: "projects.json",
        PROCESS_FOLDER_NAME: ".bolt",
        NGINX_CONFIG_FILE_NAME: "bolt.nginx.conf",
        NGINX_CONTAINER_NAME: "boltingress",
    };
});
