import { Bolt } from "./bolt";

export default interface BoltProjectRunner {
  _yamlContent: Bolt;
  up(cache?: boolean): Promise<void>;
  down(): Promise<void>;
  exec?(): Promise<void>;
}
