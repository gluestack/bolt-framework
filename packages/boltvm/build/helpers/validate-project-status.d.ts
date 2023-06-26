import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";
export declare const validateProjectStatus: (projectId: string, command: string, sealConfig?: ISealVMConfig) => Promise<IMetadata>;
