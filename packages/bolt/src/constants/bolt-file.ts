import { Bolt } from "../typings/bolt";

export const boltFile: Bolt = {
  envfile: ".env.tpl",
  project_id: "",
  project_name: "",
  default_project_runner: "host",
  default_service_runner: "local",
  services: {},
  ingress: null,
  vm: {
    name: "",
    ports: ["3000:3000"],
    command: "bolt up --host",
  },
};
