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
exports.upload = void 0;
const fs_1 = require("fs");
const config_1 = require("../../../config");
const gql_1 = require("../apis/handlers/gql");
const glue_server_sdk_js_1 = require("@gluestack/glue-server-sdk-js");
const create_deployment_1 = require("../apis/handlers/gql/create-deployment");
const inquirer = require('inquirer');
const upload = (filepath, store) => __awaiter(void 0, void 0, void 0, function* () {
    let projectHash = store.get('project_hash');
    // prompts to collect Project ID from user
    if (!projectHash || projectHash === 'new') {
        const team = store.get('team');
        let tmp;
        try {
            tmp = yield (0, gql_1.projects)(team.id, team.token);
        }
        catch (err) {
            console.log('> Error fetching projects... Please try again later.');
            process.exit(-1);
        }
        // transform key-value pairs
        const choices = [{ name: 'Create a new Project', value: 'new' }];
        choices.push(...tmp.projects.map((project) => {
            return { name: project.name, value: project.project_hash };
        }));
        // prompt to collect right project from user
        const results = yield inquirer.prompt([{
                name: 'projectHash',
                message: 'Please choose an existing project or create one',
                type: 'list',
                choices: choices
            }]);
        if (!results || !results.projectHash) {
            console.error('> Error collecting project id');
            process.exit(-1);
        }
        // store project id in the store
        projectHash = results.projectHash;
        store.set('project_hash', results.projectHash);
    }
    // upload the project zip file to minio
    const glue = new glue_server_sdk_js_1.Glue(config_1.SEAL_DOMAIN);
    try {
        const response = yield glue.storage.upload((0, fs_1.createReadStream)(filepath));
        if (response && !response.id) {
            console.error('Error uploading the project zip file to minio');
            process.exit(1);
        }
        store.set('file_id', response.id);
        console.log('> File uploaded successfully...');
    }
    catch (error) {
        console.log('> Uploading failed due to following reason:', error.message || error);
        console.log(error);
        process.exit(-1);
    }
    // submits the deployment
    console.log('> Submitting the deployment now...');
    try {
        const user = store.get('user');
        const team = store.get('team');
        const fileID = store.get('file_id');
        const projectHash = store.get('project_hash');
        const projectName = process.cwd().split('/')[process.cwd().split('/').length - 1];
        const response = yield (0, create_deployment_1.createDeployment)(projectName, projectHash === 'new' ? '' : projectHash, team.id, user.access_token, fileID);
        if (response && response.createdbdeployment && response.createdbdeployment.data) {
            const { deployment_id, project_hash } = response.createdbdeployment.data;
            // store the deployment id in the store
            store.set('deployment_id', deployment_id);
            store.set('project_hash', project_hash);
        }
        console.log('> Deployment submitted successfully...');
    }
    catch (error) {
        console.log('> Uploading failed due to following reason:', error.response.errors || error);
    }
    (0, fs_1.unlinkSync)(filepath);
});
exports.upload = upload;
