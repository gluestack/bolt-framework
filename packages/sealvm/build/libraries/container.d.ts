export default class Container {
    containerName: string;
    containersPath: string;
    constructor(containerName: string);
    createImage(): Promise<string>;
    removeImage(): Promise<boolean>;
}
