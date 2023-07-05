import { z } from "zod";
import { VM } from "../typings/bolt";
import { exitWithMsg } from "../helpers/exit-with-msg";

const ConfigSchema = z.object({
  name: z.string(),
});

export const validateVmConfig = async (context: VM): Promise<VM> => {
  try {
    await ConfigSchema.parseAsync(context);
  } catch (error: any) {
    // @ts-ignore ZodError
    await exitWithMsg(
      `Error while validating VM configuration:\n ${JSON.stringify(
        { ...error.errors },
        null,
        2
      )}`
    );
  }

  return context;
};
