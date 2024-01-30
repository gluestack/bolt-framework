import getStore from "../../helpers/get-store";
import { BoltService } from "../../typings/bolt-service";
import {
  auth,
  upload,
  zip,
  watch,
  setProject,
  deploy,
} from "../../helpers/deploy/deployment";
import Common from "../../common";

export default class DeployClass {
  store: any;
  zipPath: string = "";
  services: BoltService[] = [];
  cwd: string = process.cwd();

  constructor() {
    //
  }

  async setStore() {
    this.store = await getStore();
  }

  async saveStore() {
    this.store.save();
  }

  async getBoltFileContent() {
    const _yamlContent = await Common.getAndValidateBoltYaml();
    return _yamlContent;
  }

  // populate services
  async setServices() {
    const services: BoltService[] = this.services;
    const _yamlContent = await this.getBoltFileContent();
    // Gather all the availables services
    for await (const [serviceName] of Object.entries(_yamlContent.services)) {
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );
      services.push(content);
    }

    this.services = services;
  }

  // Create project zip file ignoring unnecessary files
  async createZip() {
    const cwd = this.cwd;
    const { zipPath } = await zip(cwd);

    this.zipPath = zipPath;
    return Promise.resolve(zipPath);
  }

  async auth(doAuth: boolean) {
    return await auth(doAuth, this.store);
  }

  async setProject(projects: any[]) {
    return await setProject(projects);
  }

  // uploads the zip into minio
  async upload() {
    return await upload(this.zipPath, this.store);
  }

  async submit({
    projectId,
    fileId,
    userId,
  }: {
    projectId: number;
    fileId: number;
    userId: number;
  }) {
    return await deploy({
      projectId,
      fileId,
      userId,
    });
  }
  // watches the deployment steps
  async watch() {
    await watch(this.store);
  }
}
