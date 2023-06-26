export default class Container {
    containerName: string;
    containersPath: string;
    constructor(containerName: string);
    createImage(cached: boolean): Promise<string>;
    removeImage(): Promise<boolean>;
}
