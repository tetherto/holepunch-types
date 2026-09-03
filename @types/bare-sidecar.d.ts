declare module "bare-sidecar" {
  import type { ChildProcess } from "node:child_process";
  import type { Duplex, DuplexEvents } from "bare-stream";

  interface SidecarEvents extends DuplexEvents {
    exit: [code: number | null, signalCode: string | null];
  }

  export default class Sidecar extends Duplex<SidecarEvents> {
    constructor(entry: string, args?: ReadonlyArray<string>, opts?: Record<string, unknown>);
    readonly _process: ChildProcess;
    readonly stdin: ChildProcess["stdin"];
    readonly stdout: NonNullable<ChildProcess["stdout"]>;
    readonly stderr: NonNullable<ChildProcess["stderr"]>;
  }
}
