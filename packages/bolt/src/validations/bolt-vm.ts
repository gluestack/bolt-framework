import { z } from "zod";
import { Vm } from "../typings/bolt";
import { exitWithMsg } from "../helpers/exit-with-msg";

const ConfigSchema = z.object({
  name: z.string(),
  source: z.string(),
  destination: z.string(),
  ports: z.array(z.string()),
  command: z.string(),
});

export const validateVmConfig = async (context: Vm): Promise<Vm> => {
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
