import { z } from "zod";
import { Seal } from "../typings/seal";
import { exitWithMsg } from "../helpers/exit-with-msg";

const ConfigSchema = z.object({
  envfile: z.string(),
  project_id: z.string(),
  project_name: z.string(),
  default_runner: z.string(),
  services: z.nullable(
    z.record(
      z.string(),
      z.object({
        path: z.string(),
      }),
    ),
  ),
});

export const validateSeal = async (context: Seal): Promise<Seal> => {
  try {
    await ConfigSchema.parseAsync(context);
  } catch (error) {
    // @ts-ignore ZodError
    await exitWithMsg(JSON.stringify({ ...error.errors }, null, 2));
  }

  return context;
};
