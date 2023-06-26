"use strict";
// import getStore from "../../helpers/get-store";
// import { BoltService } from "../../typings/bolt-service";
// import { auth, upload, zip, watch } from "../../helpers/deploy/deploy";
// import Common from "../../common";
// export default class DeployClass {
//   store: any;
//   zipPath: string = "";
//   services: BoltService[] = [];
//   cwd: string = process.cwd();
//   constructor() {
//     //
//   }
//   async setStore() {
//     this.store = await getStore();
//   }
//   async saveStore() {
//     this.store.save();
//   }
//   async getSealContent() {
//     const _yamlContent = await Common.getAndValidateBoltYaml();
//     return _yamlContent;
//   }
//   // populate services
//   async setServices() {
//     const services: BoltService[] = this.services;
//     const _yamlContent = await this.getSealContent();
//     // Gather all the availables services
//     for await (const [serviceName] of Object.entries(_yamlContent.services)) {
//       const { content } = await Common.getAndValidateService(
//         serviceName,
//         _yamlContent
//       );
//       services.push(content);
//     }
//     this.services = services;
//   }
//   // Create project zip file ignoring unnecessary files
//   async createZip() {
//     const cwd = this.cwd;
//     const { zipPath } = await zip(cwd);
//     this.zipPath = zipPath;
//     return Promise.resolve(zipPath);
//   }
//   // Authenticates users credentials and
//   // stores the details into the project's store
//   async auth(doAuth: boolean) {
//     await auth(doAuth, this.store);
//   }
//   // uploads the zip into minio
//   async upload() {
//     await upload(this.zipPath, this.store);
//   }
//   // watches the deployment steps
//   async watch() {
//     await watch(this.store);
//   }
// }
