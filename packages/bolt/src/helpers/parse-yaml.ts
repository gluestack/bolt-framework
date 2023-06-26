import { parse, YAMLParseError, YAMLWarning } from "yaml";
import { exitWithMsg } from "./exit-with-msg";
import { readfile } from "./fs-readfile";

export const parseYAML = async (filepath: string): Promise<any> => {
  const content: string = await readfile(filepath);

  try {
    const parsed: any = parse(content);
    return parsed;
  } catch (error) {
    if (error instanceof YAMLParseError || error instanceof YAMLWarning) {
      await exitWithMsg(JSON.stringify({ ...error }, null, 2));
    }
    return `>> ${filepath} is not a valid yaml file`;
  }
};
