export default class ExposePort {
    private exposePort;
    handle(localPath: string, ports: string[]): Promise<void>;
}
