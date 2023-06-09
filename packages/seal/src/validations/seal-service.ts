import { z } from "zod";
import { platforms } from "../constants/platforms";
import { SealService } from "../typings/seal-service";
import { exitWithMsg } from "../helpers/exit-with-msg";

const ServiceConfigSchema = z.object({
  container_name: z.string(),
  platforms: z.record(
    z.enum(platforms),
    z.object({
      envfile: z.string(),
      build: z.string(),
      context: z.string().optional()
    }),
  ),
});

export const validateSealService = async (
  context: SealService,
): Promise<SealService> => {
  try {
    await ServiceConfigSchema.parseAsync(context);
  } catch (error) {
    // @ts-ignore ZodError
    await exitWithMsg(error.errors);
  }

  return context;
};
