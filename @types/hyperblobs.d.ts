declare module "hyperblobs" {
  import type Corestore from "corestore";

  type Hypercore = ReturnType<Corestore["get"]>;

  export interface BlobId {
    readonly blockOffset: number;
    readonly blockLength: number;
    readonly byteOffset: number;
    readonly byteLength: number;
  }

  // A streamx Writable; `id` is only populated once the stream fully closes
  // (Hyperblobs doesn't know a blob's final bounds until writing ends).
  export interface HyperblobsWriteStream {
    readonly id: BlobId;
    write(chunk: Uint8Array): boolean;
    end(): void;
    once(event: "close" | "drain" | "error", listener: (err?: Error) => void): void;
  }

  export default class Hyperblobs {
    constructor(core: Hypercore, opts?: { blockSize?: number });

    readonly core: Hypercore;
    readonly key: Buffer;
    readonly blockSize: number;

    ready(): Promise<void>;
    close(): Promise<void>;
    put(blob: Uint8Array, opts?: { blockSize?: number }): Promise<BlobId>;
    get(id: BlobId, opts?: { wait?: boolean; timeout?: number }): Promise<Buffer | null>;
    clear(id: BlobId, opts?: Record<string, unknown>): Promise<void>;
    createWriteStream(opts?: { blockSize?: number }): HyperblobsWriteStream;
    createReadStream(
      id: BlobId,
      opts?: { wait?: boolean; timeout?: number },
    ): AsyncIterable<Buffer>;
  }
}
