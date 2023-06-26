import { Bolt } from "../typings/bolt";

export const boltFile: Bolt = {
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
