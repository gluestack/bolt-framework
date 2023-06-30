import { IBolt } from "../typings/bolt";
import { IMetadata } from "../typings/metadata";
export default class Common {
    static createProjectMetadata(boltConfig: IBolt): Promise<IMetadata>;
}
