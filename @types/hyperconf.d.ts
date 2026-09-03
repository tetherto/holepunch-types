declare module "hyperconf/builder" {
  export default class HyperconfBuilder {
    static from(schemaDir: string, dir: string): HyperconfBuilder;
    static toDisk(conf: HyperconfBuilder, opts?: { dir?: string }): void;
    setProduction(type: string, config: unknown): Uint8Array;
    setDevelopment(type: string, config: unknown): Uint8Array;
  }
}

declare module "hyperconf" {
  import type ReadyResource from "ready-resource";
  import type { Hypercore } from "corestore";

  interface Spec<T> {
    readonly production: T | null;
    readonly development: T | null;
    readonly productionEncoding: unknown;
    readonly developmentEncoding: unknown;
  }

  export default class HyperConf<T = unknown> extends ReadyResource {
    constructor(
      spec: Spec<T>,
      core: Hypercore,
      opts?: { minLength?: number; production?: boolean },
    );
    readonly core: Hypercore;
    current: T | null;
    // fires whenever the operator appends a newer config
    on(event: "update", listener: (config: T) => void): this;
  }
}
