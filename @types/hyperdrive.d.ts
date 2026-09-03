declare module "hyperdrive" {
  import type Corestore from "corestore";
  import type Hyperblobs from "hyperblobs";
  import type { Writable } from "streamx";

  type Hypercore = ReturnType<Corestore["get"]>;

  interface HyperdriveEntry {
    seq: number;
    key: string;
    value: {
      executable: boolean;
      linkname: string | null;
      blob: { byteLength: number } | null;
      metadata: unknown;
    };
  }

  interface DriveEntryOpts {
    follow?: boolean;
    timeout?: number;
    wait?: boolean;
  }

  export default class Hyperdrive {
    constructor(store: Corestore, key?: Buffer | null, opts?: Record<string, unknown>);
    readonly key: Buffer | null;
    readonly discoveryKey: Buffer | null;
    readonly writable: boolean;
    readonly core: Hypercore;
    readonly blobs: Hyperblobs | null;
    ready(): Promise<void>;
    close(): Promise<void>;
    getBlobs(): Promise<Hyperblobs>;
    findingPeers(): () => void;
    entry(key: string, opts?: DriveEntryOpts): Promise<HyperdriveEntry | null>;
    get(key: string, opts?: DriveEntryOpts): Promise<Buffer | null>;
    put(key: string, buffer: Uint8Array, opts?: { executable?: boolean }): Promise<void>;
    del(key: string): Promise<void>;
    symlink(key: string, linkname: string): Promise<void>;
    list(
      folder?: string,
      opts?: { recursive?: boolean; ignore?: string | string[] | ((key: string) => boolean) },
    ): AsyncIterable<HyperdriveEntry>;
    entries(
      range?: { gt?: string; gte?: string; lt?: string; lte?: string },
      opts?: { ignore?: (key: string) => boolean },
    ): AsyncIterable<HyperdriveEntry>;
    createReadStream(
      key: string,
      opts?: { start?: number; end?: number; length?: number; follow?: boolean },
    ): AsyncIterable<Buffer>;
    createWriteStream(
      key: string,
      opts?: { executable?: boolean; metadata?: unknown },
    ): Writable;
  }
}
