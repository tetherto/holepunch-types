declare module "corestore" {
  import type { Duplex } from "node:stream";

  export interface Hypercore {
    readonly key: Buffer;
    readonly discoveryKey: Buffer;
    readonly length: number;
    readonly byteLength: number;
    readonly writable: boolean;
    readonly opened: boolean;
    readonly closed: boolean;
    readonly peers: ReadonlyArray<unknown>;
    ready(): Promise<void>;
    close(): Promise<void>;
    get(index: number, opts?: Record<string, unknown>): Promise<Buffer | null>;
    append(blocks: ReadonlyArray<Uint8Array> | Uint8Array): Promise<void>;
    clear(start: number, end?: number, opts?: Record<string, unknown>): Promise<void>;
    has(index: number): Promise<boolean>;
    getUserData(key: string): Promise<Buffer | null>;
    setUserData(key: string, value: Uint8Array): Promise<void>;
    on(event: string, handler: (...args: unknown[]) => void): void;
    off(event: string, handler: (...args: unknown[]) => void): void;
  }

  export default class Corestore {
    constructor(
      storage: string | import("hypercore-storage").default,
      opts?: Record<string, unknown>,
    );
    ready(): Promise<void>;
    // rocksdb column families back sibling local stores (e.g. the worker's local HyperDB).
    readonly storage: {
      readonly rocks: { columnFamily(name: string): unknown };
    };
    // Deterministic: derived from the store's persisted primary key + name,
    // so the same storage dir yields the same keypair on every open.
    createKeyPair(name: string): Promise<{
      readonly publicKey: Buffer;
      readonly secretKey: Buffer;
    }>;
    // Namespaced session sharing this store's storage and replication.
    namespace(name: string | Buffer): Corestore;
    session(opts?: Record<string, unknown>): Corestore;
    get(opts: { name: string; encryptionKey?: Buffer }): Hypercore;
    get(opts: { key: Buffer; encryptionKey?: Buffer }): Hypercore;
    get(key: Buffer): Hypercore;
    // a boolean opens a fresh protocol stream (isInitiator) for piping two stores directly
    replicate(target: Duplex | boolean): Duplex;
    suspend(opts?: { readonly log?: (msg: string) => void }): Promise<void>;
    resume(opts?: { readonly log?: (msg: string) => void }): Promise<void>;
    close(): Promise<void>;
  }
}
