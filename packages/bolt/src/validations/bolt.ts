import { z } from "zod";
import { Bolt } from "../typings/bolt";
import { exitWithMsg } from "../helpers/exit-with-msg";

const ConfigSchema = z.object({
  envfile: z.string(),
  project_id: z.string(),
  project_name: z.string(),
  default_project_runner: z.string(),
  default_service_runner: z.string(),
  services: z.nullable(
    z.record(
      z.string(),
      z.object({
        path: z.string(),
      })
    )
  ),
});

export const validateBolt = async (context: Bolt): Promise<Bolt> => {
  try {
    await ConfigSchema.parseAsync(context);
  } catch (error) {
    // @ts-ignore ZodError
    await exitWithMsg(JSON.stringify({ ...error.errors }, null, 2));
  }

  return context;
};
