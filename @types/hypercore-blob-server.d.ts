declare module "hypercore-blob-server" {
  import type Corestore from "corestore";

  export interface BlobId {
    readonly blockOffset: number;
    readonly blockLength: number;
    readonly byteOffset: number;
    readonly byteLength: number;
  }

  export interface BlobServerOptions {
    readonly port?: number;
    readonly host?: string;
    readonly token?: string | Buffer;
    readonly protocol?: "http" | "https";
    readonly anyPort?: boolean;
    readonly resolve?: (
      key: Buffer,
      info: { readonly blob?: BlobId; readonly filename?: string },
    ) => { readonly key?: Buffer; readonly encryptionKey?: Buffer } | null | Promise<{
      readonly key?: Buffer;
      readonly encryptionKey?: Buffer;
    } | null>;
  }

  export interface BlobLinkOptions {
    readonly blob?: BlobId;
    readonly filename?: string;
    readonly type?: string;
    readonly url?: boolean;
  }

  export default class HypercoreBlobServer {
    constructor(store: Corestore, opts?: BlobServerOptions);
    readonly port: number;
    readonly token: string;
    listen(): Promise<void>;
    close(): Promise<void>;
    suspend(): Promise<void>;
    resume(): Promise<void>;
    getLink(key: Buffer | string, opts?: BlobLinkOptions): string;
    refreshLink(link: string): string;
    clear(key: Buffer | string, opts?: BlobLinkOptions): Promise<number>;
  }
}
