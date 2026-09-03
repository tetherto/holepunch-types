declare module "autobee" {
  import type Wakeup from "protomux-wakeup";
  import type ReadyResource from "ready-resource";

  export interface AutobeeOplogRef {
    readonly key: Buffer;
    readonly length: number;
  }

  export interface AutobeeOptions<T = AutobeeView> {
    readonly name?: string;
    readonly apply?: (
      nodes: ReadonlyArray<AutobeeNode>,
      view: T,
      host: AutobeeHost,
    ) => Promise<void>;
    readonly update?: (view: T, changes: AutobeeChanges) => Promise<void> | void;
    // Called synchronously in the constructor; the return value is NOT awaited before becoming `view`.
    readonly open?: (bee: AutobeeView, autobee: Autobee) => T;
    readonly close?: (view: T) => Promise<void>;
    // Fast-forward trust: is this writer key one we vouch for, judged against `reference`.
    readonly isTrusted?: (key: Buffer, reference: T) => Promise<boolean> | boolean;
    // `reference` is null at flush time, where `target` is our own view
    readonly mostRecentTrusted?: (
      target: T,
      reference: T | null,
    ) => Promise<AutobeeOplogRef | null> | AutobeeOplogRef | null;
    readonly fastForward?: {
      // an object carrying `key` is read as a legacy pointer, so a head must be wrapped
      readonly boot?: {
        readonly head?: AutobeeOplogRef | null;
        readonly legacy?: AutobeeOplogRef | null;
      } | null;
      readonly conservative?: boolean;
    };
    // Wakeup session credential: pending-writer announcements flow between
    // holders of the same capability key. Defaults to the base key.
    readonly wakeupCapability?: {
      readonly key: Buffer;
      readonly discoveryKey: Buffer;
    };
    // Shared protomux-wakeup instance; without it autobee creates a private
    // one that no connection stream is ever added to, so wakeup stays inert.
    readonly wakeup?: Wakeup;
    readonly optimistic?: boolean;
    readonly encrypted?: boolean;
    readonly encryptionKey?: Buffer;
    // Base/local writer keypair; a promise is awaited at boot.
    readonly keyPair?:
      | { readonly publicKey: Buffer; readonly secretKey: Buffer }
      | Promise<{ readonly publicKey: Buffer; readonly secretKey: Buffer }>;
  }

  export interface AutobeeNode {
    readonly value: Buffer | null;
    readonly key: Buffer;
    readonly length: number;
  }

  export interface BeeWriteBatch {
    tryPut(key: Buffer, value: Buffer): void;
    tryDelete(key: Buffer): void;
    flush(): Promise<void>;
  }

  export type DiffEntry = {
    readonly key: Buffer;
    readonly value: Buffer;
  };

  export type DiffPair = {
    readonly left: DiffEntry | null;
    readonly right: DiffEntry | null;
  };

  export type DiffStream = AsyncIterable<DiffPair> & {
    _readableState: {
      map: ((data: unknown) => unknown) | null;
    };
    on(event: string, listener: () => void): void;
  };

  export interface BeeEntry {
    readonly key: Buffer;
    readonly value: Buffer;
  }

  // hyperbee2: checkout() returns a full bee view rooted at a past length.
  // The view core is append-only — autobase reorgs move the root, never
  // rewrite blocks — so a checkout at any past length is stable history.
  export interface AutobeeView {
    readonly core: { readonly length: number };
    head(): BeeHead | null;
    write(): BeeWriteBatch;
    get(key: Buffer): Promise<BeeEntry | null>;
    createReadStream(opts?: Record<string, unknown>): AsyncIterable<BeeEntry>;
    createDiffStream(right: AutobeeView, opts?: Record<string, unknown>): DiffStream;
    checkout(opts: { readonly length?: number; readonly key?: Buffer | null }): AutobeeView;
    close(): Promise<void>;
  }

  export interface AutobeeHost {
    readonly genesis: boolean;
    readonly clock: number;
    addWriter(key: Buffer | string, opts?: { readonly isIndexer?: boolean }): Promise<void>;
    removeWriter(key: Buffer | string): Promise<void>;
    // halts the drain at this batch instead of closing the base; only legal inside apply
    interrupt(reason?: unknown): never;
  }

  export interface AutobeeChanges {
    // shared is the common ancestor — equal to from on a linear update, older than it
    // when a reboot (fast-forward/reorg) moved the head past locally-unapplied ops.
    get(name: string): {
      readonly from: BeeHead;
      readonly to: BeeHead;
      readonly shared: { readonly key: Buffer | null; readonly length: number } | null;
    };
  }

  export interface BeeHead {
    readonly length: number;
    readonly key: Buffer;
  }

  export interface AutobeeWriterInfo {
    readonly key: Buffer;
    readonly length: number;
    readonly isIndexer: boolean;
    readonly isRemoved: boolean;
    readonly isOplog: boolean;
  }

  // A writer's oplog core. 'append' fires when the length grows, including when
  // a remote head is verified: the moment we learn a peer has written.
  // 'download' fires per block that reaches us, which is what moves
  // contiguousLength: how much of the oplog is actually here.
  export interface AutobeeWriter {
    readonly core: {
      readonly key: Buffer;
      readonly length: number;
      readonly contiguousLength: number;
      on(event: "append" | "download", listener: () => void): void;
    };
  }

  export interface AutobeeSystemInfo {
    readonly heads: ReadonlyArray<{
      readonly key: Buffer;
      readonly length: number;
    }>;
    // The flushed view head; length 0 until the first post-genesis drain flushes it.
    readonly view: { readonly key: Buffer | null; readonly length: number };
    readonly flushes: number;
  }

  export interface AutobeeSystem {
    readonly bee: AutobeeView;
    readonly flushes: number;
    readonly view: { readonly key: Buffer | null; readonly length: number } | null;
    get(key: Buffer, opts?: { readonly unflushed?: boolean }): Promise<AutobeeWriterInfo | null>;
    getInfo(): Promise<AutobeeSystemInfo | null>;
    isGenesis(): boolean;
  }

  export default class Autobee<T = AutobeeView> extends ReadyResource {
    constructor(
      store: unknown,
      key?: Buffer | string | null | AutobeeOptions,
      handlers?: AutobeeOptions<T>,
    );
    readonly key: Buffer;
    readonly discoveryKey: Buffer;
    readonly writable: boolean;
    readonly stats: {
      readonly undos: number;
      readonly fastForwards: number;
      readonly drains: number;
      readonly applies: number;
      readonly appends: number;
    };
    // The corestore session the base was built on; store-level replication.
    readonly store: import("corestore").default;
    // The value returned by the open() handler (the bee itself by default).
    readonly view: T;
    readonly bee: AutobeeView;
    readonly local: {
      readonly key: Buffer;
      readonly id: string;
      readonly length: number;
      readonly peers: ReadonlyArray<{ readonly remoteLength: number }>;
      on(event: "upload", listener: (index: number) => void): void;
      off(event: "upload", listener: (index: number) => void): void;
      on(event: "peer-remove", listener: () => void): void;
      off(event: "peer-remove", listener: () => void): void;
    };
    readonly system: AutobeeSystem;
    // The reason passed to host.interrupt(), latched even when the throw is swallowed
    readonly interrupted: unknown;
    // Attached writers, local included. A writer enters the set with a 'writer' event.
    readonly activeWriters: Iterable<AutobeeWriter>;
    readonly isIndexer: boolean;
    readonly writers: {
      readonly writable: boolean;
      has(hex: string): boolean;
      // Register a remote writer-core hint so its blocks get fetched.
      wakeup(key: Buffer, length: number): void;
    };
    ready(): Promise<void>;
    setLocal(
      key?: Buffer | null,
      opts?: {
        readonly keyPair?: { readonly publicKey: Buffer; readonly secretKey: Buffer };
      },
    ): Promise<void>;
    append(
      data: Buffer | Buffer[],
      opts?: { readonly force?: boolean; readonly optimistic?: boolean },
    ): Promise<void>;
    updated(): Promise<void>;
    update(): Promise<void>;
    getMostRecentHead(): Promise<AutobeeOplogRef | undefined>;
    flush(): Promise<void>;
    replicate(...args: unknown[]): unknown;
    openCore(key: Buffer): {
      get(index: number): Promise<Buffer | null>;
      ready(): Promise<void>;
      close(): Promise<void>;
      readonly length: number;
    };
    // Vendor-private, but the only way to read the system checkpoint a core's
    // last oplog block embeds (used to mint fast-forward invite targets).
    _getOplog(
      key: Buffer,
      length: number,
    ): Promise<{
      readonly views: {
        readonly system: AutobeeOplogRef;
        readonly flushes: number;
      };
    } | null>;
    close(): Promise<void>;
  }
}
