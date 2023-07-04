export default class ExposePort {
    private exposePort;
    handle(localPath: string, port: string): Promise<void>;
}
