import { stringify, YAMLParseError, YAMLWarning } from "yaml";
import { exitWithMsg } from "./exit-with-msg";
import { writefile } from "./fs-writefile";

export const stringifyYAML = async (
  json: any,
  filepath: string,
): Promise<any> => {
  try {
    const parsed: any = stringify(json);
    await writefile(filepath, parsed);
  } catch (error) {
    if (error instanceof YAMLParseError || error instanceof YAMLWarning) {
      await exitWithMsg({ ...error });
    }
    return `> Error in Writing to ${filepath}, not a valid json`;
  }
};
