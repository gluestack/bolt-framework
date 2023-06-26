import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";
export declare function createProject(sealConfig: ISealVMConfig): Promise<IMetadata>;
declare const _default: (localPath: string) => Promise<void>;
export default _default;
