"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const gql_1 = require("../apis/handlers/gql");
let count = 50;
const watch = (store) => __awaiter(void 0, void 0, void 0, function* () {
    let deploymentId = store.get("deployment_id");
    // prompts to collect Project ID from user
    if (!deploymentId) {
        console.log("> Deployment not saved properly... Please try again later.");
        return;
    }
    let interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const isDone = yield getDeployment(deploymentId, store);
        if (isDone) {
            clearInterval(interval);
        }
    }), 5 * 1000);
});
exports.watch = watch;
function getDeployment(deploymentId, store) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const team = store.get("team");
            const { db_deployments_by_pk } = yield (0, gql_1.deployment)(deploymentId, team.token);
            return yield showAndGetProgress(db_deployments_by_pk.infra_json);
        }
        catch (err) {
            console.log("> Error fetching deployment... Please try again later.");
            return true;
        }
    });
}
function parseToTable(obj) {
    return {
        Step: obj.deployment_task.action.replaceAll("_", " "),
        Status: obj.status,
        "Started at": obj.started_at
            ? new Date(obj.started_at).toLocaleString()
            : "N/A",
        "Ended at": obj.ended_at ? new Date(obj.ended_at).toLocaleString() : "N/A",
    };
}
function showAndGetProgress(infra_json) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!infra_json) {
            if (--count === 0) {
                console.log("> Error fetching deployment... Please try again later.");
                return true;
            }
            return false;
        }
        try {
            let infra_object = JSON.parse(infra_json);
            if (infra_object.error) {
                console.log(`> Error : ${infra_object.error}`);
                return true;
            }
            const myTable = [];
            let flag = true;
            Object.keys(infra_object).map((key) => {
                if (infra_object[key].status === "inprogress" || infra_object[key].status === "pending") {
                    flag = false;
                }
                myTable.push(parseToTable(infra_object[key]));
            });
            console.clear();
            console.log('> Watching deployment!\n');
            console.log("> Refreshed at...", new Date().toLocaleString());
            console.table(myTable);
            if (flag) {
                Object.keys(infra_object).map((key) => {
                    if (infra_object[key].deployment_task.action === "domain_mapping") {
                        try {
                            const comments = JSON.parse(infra_object[key].comments);
                            const endpoints = comments.data.endpoints.map((endpoint) => {
                                return {
                                    "Domain": `https://${endpoint.domain}`,
                                };
                            });
                            console.table(endpoints);
                        }
                        catch (e) {
                            //
                        }
                    }
                });
            }
            return flag;
        }
        catch (e) {
            //
        }
        return true;
    });
}
