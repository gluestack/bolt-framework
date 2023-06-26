export default class Vm {
    private projectPath;
    private containerPath;
    private sshPort;
    constructor(projectPath: string, containerPath: string, sshPort: number);
    private boot;
    static connect(portNumber?: number): Promise<any>;
    static connectOnce(portNumber?: number): Promise<any>;
    static create(projectPath: string, containerPath: string, sshPort: number): Promise<number>;
    static destroy(processId: number): Promise<void>;
}
