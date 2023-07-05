/** Driver for Service Runner **/
export default interface BoltServiceRunner {
  volume?: string;
  build?: string;

  start(serviceName?: string): Promise<void> | Promise<number | undefined>;
  stop(processId?: number): Promise<void>;
  logs(isFollow: boolean, serviceName?: string): Promise<void>;
  exec?(): Promise<void>;
}
