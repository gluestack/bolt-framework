import AddMetadata from "./actions/addMetadata";
import Create from "./actions/create";
import Doctor from "./actions/doctor";
import Down from "./actions/down";
import Exec from "./actions/exec";
import ExecuteCommand from "./actions/executeCommand";
import ExposePort from "./actions/exposePort";
import Log from "./actions/log";
import Run from "./actions/run";
import Status from "./actions/status";
import { IBoltVm } from "./typings/boltvm";

export default class BoltVm implements IBoltVm {
  location: string;
  constructor(location: string) {
    this.location = location;
  }

  public async addMetadata() {
    const addMetadata = new AddMetadata();
    await addMetadata.handle(this.location);
  }

  public async create(cache: boolean) {
    const create = new Create();
    await create.handle(this.location, cache);
  }

  public async run(command: string, detached: boolean) {
    const run = new Run();
    await run.handle(command, this.location, detached);
  }

  public async exposePort(ports: string[]) {
    const exposePort = new ExposePort();
    await exposePort.handle(this.location, ports);
  }

  public async exec() {
    const exec = new Exec();
    await exec.handle(this.location);
  }

  public async log(isFollow: boolean) {
    const log = new Log();
    await log.handle(this.location, isFollow);
  }

  public async down() {
    const down = new Down();
    await down.handle(this.location);
  }

  public async status() {
    const status = new Status();
    await status.handle(this.location);
  }

  public async doctor() {
    const doctor = new Doctor();
    await doctor.handle();
  }

  public async executeCommand(command: string, detached: boolean) {
    const executeCommand = new ExecuteCommand();
    await executeCommand.handle(command, this.location, detached);
  }
}
