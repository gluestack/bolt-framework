import { z } from "zod";
import {
  hostServiceRunners,
  supportedServiceRunners,
} from "../constants/platforms";
import { BoltService } from "../typings/bolt-service";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { BOLT } from "../constants/bolt-configs";

const ServiceConfigSchema = z.object({
  container_name: z.string(),
  default_service_runner: z.enum(supportedServiceRunners),
  supported_service_runners: z.array(z.enum(supportedServiceRunners)),
  service_runners: z.record(
    z.enum(hostServiceRunners),
    z.object({
      envfile: z.string(),
      build: z.string(),
      // context: z.string().optional(),
    })
  ),
});

export const validateBoltService = async (
  context: BoltService
): Promise<BoltService> => {
  try {
    await ServiceConfigSchema.parseAsync(context);
  } catch (error: any) {
    // @ts-ignore ZodError
    await exitWithMsg(
      `Error while validating ${BOLT.SERVICE_YAML_FILE_NAME}: ${error.message}`
    );
  }

  return context;
};
