import ServiceUp from "../../actions/service-up";
import ServiceDown from "../../actions/service-down";

import Common from "../../common";
import getStore from "../../helpers/get-store";

import { getStoreData } from "../../helpers/get-store-data";
import { updateStore } from "../../helpers/update-store";

import { Bolt } from "../../typings/bolt";
import { ServiceRunners, StoreServices } from "../../typings/store-service";
import ProjectRunner from "../../typings/bolt-project-runner";

export default class ProjectRunnerHost implements ProjectRunner {
  _yamlContent: Bolt;

  constructor(_yamlContent: Bolt) {
    this._yamlContent = _yamlContent;
  }

  // Resolves the service runner
  public resolveServiceRunner(
    defaultServiceRunner: ServiceRunners,
    providedRunner: Array<ServiceRunners>
  ) {
    if (providedRunner.includes(defaultServiceRunner)) {
      return defaultServiceRunner;
    } else {
      return providedRunner[0];
    }
  }

  public async up() {
    const data = await getStoreData("services");
    const _yamlContent = this._yamlContent;
    const serviceRunner = _yamlContent.default_service_runner;
    const servicePromises: any[] = [];

    // Creating an instance of ServiceUp class
    const boltServiceUp = new ServiceUp();

    // Looping through all services in bolt.yaml
    Object.entries(_yamlContent.services).forEach(async ([serviceName]) => {
      // If service is already up, skip
      if (data[serviceName] && data[serviceName].status !== "down") {
        return;
      }

      // Validating and getting content from bolt.service.yaml
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      // Pushing the services in a Promise array to run them in parallel
      servicePromises.push(
        boltServiceUp.handle(serviceName, {
          serviceRunner: this.resolveServiceRunner(
            serviceRunner,
            Object.keys(content.service_runners) as Array<ServiceRunners>
          ),
          ports: [],
        })
      );
    });

    // Running all services in parallel
    await Promise.all(servicePromises);

    // Updating the store
    await updateStore("project_runner", "host");
  }

  public async down() {
    const store = await getStore();
    const data: StoreServices = await store.get("services");
    const servicePromises: any[] = [];
    const yamlContent = this._yamlContent;

    // Creating an instance of ServiceUp class
    const boltServiceDown = new ServiceDown();

    // All the services whose status is down are appended to servicePromises array and later gets resolved
    Object.entries(yamlContent.services).forEach(([serviceName]) => {
      // If service is already down, skip
      if (data[serviceName] && data[serviceName].status !== "up") {
        return;
      }

      // Pushing the services in a Promise array to shut down them in parallel
      servicePromises.push(boltServiceDown.handle(serviceName));
    });

    // Shutting down all services in parallel
    await Promise.all(servicePromises);

    // Updating the store
    await updateStore("project_runner", "none");
  }
}
