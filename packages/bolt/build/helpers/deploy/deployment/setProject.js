var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../exit-with-msg", "../../get-store-data", "../apis/api-request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setProject = void 0;
    const exit_with_msg_1 = require("../../exit-with-msg");
    const get_store_data_1 = require("../../get-store-data");
    const api_request_1 = require("../apis/api-request");
    const inquirer = require("inquirer");
    const setProject = (projects) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const choices = [{ name: "Create a new Project", value: "create" }];
            if (projects.length) {
                choices.push({ name: "Select a project", value: "select" });
            }
            const user = yield (0, get_store_data_1.getStoreData)("user");
            if (!user.id) {
                yield (0, exit_with_msg_1.exitWithMsg)("Error setting action for project Creation!");
            }
            const result = yield inquirer.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Please choose an existing project or create one",
                    choices: choices,
                },
            ]);
            if (!result || !result.action) {
                yield (0, exit_with_msg_1.exitWithMsg)("Error setting action for project Creation!");
                return;
            }
            switch (result.action) {
                case "create":
                    const createPrompt = yield inquirer.prompt([
                        {
                            type: "input",
                            name: "name",
                            message: "Please enter a name for the project",
                        },
                    ]);
                    const body = {
                        project_name: createPrompt.name,
                        created_by: user.id,
                    };
                    const { data } = yield (0, api_request_1.apiRequest)({
                        method: "POST",
                        data: body,
                        route: "/projects",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!data || !data.success || !data.data.project) {
                        console.log({ data });
                        yield (0, exit_with_msg_1.exitWithMsg)("Error creating project!");
                    }
                    const project = data.data.project;
                    delete project.user;
                    return project;
                    break;
                case "select":
                    const choices = projects.map((project) => {
                        return { name: project.name, value: project };
                    });
                    const selectPrompt = yield inquirer.prompt([
                        {
                            type: "list",
                            name: "selectedProject",
                            message: "Please choose an existing project or create one",
                            choices: choices,
                        },
                    ]);
                    return selectPrompt.selectedProject;
                    break;
                default:
                    yield (0, exit_with_msg_1.exitWithMsg)("Error setting action for project Creation!");
            }
            return result;
        }
        catch (error) {
            console.log({ error: error.response.data || "nothing" });
            yield (0, exit_with_msg_1.exitWithMsg)("Error While Project Selection!");
        }
    });
    exports.setProject = setProject;
});
