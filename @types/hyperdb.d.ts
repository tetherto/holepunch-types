declare module "hyperdb" {
  export type HyperDBRecord = Record<string, unknown>;

  export interface HyperDBFindOptions<T = HyperDBRecord> {
    readonly gt?: Partial<T>;
    readonly gte?: Partial<T>;
    readonly lt?: Partial<T>;
    readonly lte?: Partial<T>;
    readonly reverse?: boolean;
    readonly limit?: number;
    readonly checkout?: number;
  }

  // streamx Readable of decoded documents.
  export interface HyperDBStream<T = HyperDBRecord> extends AsyncIterable<T> {
    one(): Promise<T | null>;
    toArray(): Promise<T[]>;
    destroy(err?: Error): void;
    on(event: string, handler: (...args: unknown[]) => void): void;
  }

  export interface HyperDBBee2Options {
    // Re-snapshot on every bee 'update' so reads track the view head.
    readonly autoUpdate?: boolean;
    readonly trace?: (...args: unknown[]) => void;
    readonly key?: Buffer | null;
    readonly length?: number;
  }

  export type ViewChange<
    T extends object = HyperDBRecord,
    K extends object = HyperDBRecord,
  > =
    | {
        readonly type: "insert";
        readonly collection: string;
        readonly value: T;
      }
    | {
        readonly type: "delete";
        readonly collection: string;
        readonly value: K;
      };

  export default class HyperDB {
    static bee2(bee: unknown, definition: unknown, options?: HyperDBBee2Options): HyperDB;
    // Local (non-replicated) engine on rocksdb storage.
    static rocks(
      storage: unknown,
      definition: unknown,
      options?: {
        readonly readOnly?: boolean;
        readonly trace?: (...args: unknown[]) => void;
      },
    ): HyperDB;

    readonly closed: boolean;
    readonly writable: boolean;
    readonly readable: boolean;
    // Underlying Hyperbee/core handle; `head()` is the current view head (null when empty).
    readonly db: {
      head(): { readonly key: Buffer; readonly length: number } | null;
    };

    ready(): Promise<void>;
    close(): Promise<void>;

    get<T = HyperDBRecord>(
      collection: string,
      query: HyperDBRecord,
      options?: { readonly checkout?: BeeHead },
    ): Promise<T | null>;
    // Q is the index key shape; a mapped index derives it, so it need not be a subset of T.
    find<T = HyperDBRecord, Q = T>(
      collectionOrIndex: string,
      query?: HyperDBFindOptions<Q>,
      options?: HyperDBFindOptions<Q>,
    ): HyperDBStream<T>;
    findOne<T = HyperDBRecord, Q = T>(
      collectionOrIndex: string,
      query?: HyperDBFindOptions<Q>,
      options?: HyperDBFindOptions<Q>,
    ): Promise<T | null>;

    changes<
      T extends object = HyperDBRecord,
      K extends object = HyperDBRecord,
    >(range: { from: BeeHead }): AsyncIterable<ViewChange<T, K>>;

    // `T extends object` (not HyperDBRecord) so plain interfaces are assignable; buffered until flush().
    insert<T extends object = HyperDBRecord>(collection: string, doc: T): Promise<void>;
    delete(collection: string, query: HyperDBRecord): Promise<void>;
    insertAll<T extends object = HyperDBRecord>(
      batch: ReadonlyArray<[string, T] | [string, T, { readonly type?: "delete" }]>,
    ): Promise<void>;
    flush(): Promise<void>;

    // Throws if the engine advanced under a transaction; snapshot() pins reads.
    snapshot(): HyperDB;
    transaction(): HyperDB;
    exclusiveTransaction(): Promise<HyperDB>;

    update(): void;
    watch(fn: () => void): void;
    unwatch(fn: () => void): void;
  }
}
