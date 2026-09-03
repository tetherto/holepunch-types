declare module "hypercore-storage" {
  import type {
    BottommostLevelCompaction,
    GarbageCollectionPolicy,
  } from "rocksdb-native";

  // Forwarded to the store's rocksdb column family; blob GC is what reclaims
  // space from cleared core data.
  export interface CorestoreStorageOptions {
    readonly readOnly?: boolean;
    readonly allowBackup?: boolean;
    readonly alwaysRecover?: boolean;
    readonly wait?: boolean;
    readonly id?: string;
    readonly blobFileSize?: number;
    readonly blobGarbageCollectionAgeCutOff?: number;
    readonly blobGarbageCollectionForceThreshold?: number;
  }

  // AgeCutoff here, AgeCutOff on the column family above — the deps spell it differently.
  export interface CompactOptions {
    readonly exclusive?: boolean;
    readonly blobGarbageCollectionPolicy?: GarbageCollectionPolicy;
    readonly blobGarbageCollectionAgeCutoff?: number;
    readonly bottommostLevelCompaction?: BottommostLevelCompaction;
  }

  // The corestore storage backend; its rocksdb exposes column families for
  // sibling local stores (e.g. the worker's local HyperDB).
  export default class CorestoreStorage {
    constructor(storagePath: string, opts?: CorestoreStorageOptions);
    readonly rocks: { columnFamily(name: string): unknown };
    close(): Promise<void>;
    compact(opts?: CompactOptions): Promise<void>;
  }
}
