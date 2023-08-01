import { Bolt } from "../typings/bolt";

export const getServicesList = (_yamlContent: Bolt) => {
  const services = _yamlContent.services;
  return Object.keys(services);
};
