import { IMetadata } from "../typings/metadata";
import { IBolt } from "../typings/bolt";
import { BoltVmActions } from "../typings/boltvm-actions";
export declare const validateProjectStatus: (action: BoltVmActions, boltConfig: IBolt) => Promise<IMetadata>;
