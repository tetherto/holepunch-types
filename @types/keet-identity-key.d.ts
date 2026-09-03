declare module "keet-identity-key" {
  import type { KeyPair } from "hypercore-crypto";

  export interface VerifyOptions {
    readonly receipt?: Uint8Array;
    readonly expectedIdentity?: Buffer;
    readonly expectedDevice?: Buffer;
  }

  export interface VerifiedProof {
    readonly receipt: Buffer;
    readonly identityPublicKey: Buffer;
    readonly devicePublicKey: Buffer;
  }

  export default class IdentityKey {
    static generateMnemonic(): string;
    static from(root: { mnemonic: string }): Promise<IdentityKey>;
    static attestDevice(publicKey: Buffer, parent: KeyPair, proof: Buffer): Buffer;
    static verify(
      proof: Uint8Array,
      attestedData: Uint8Array | null,
      opts?: VerifyOptions,
    ): VerifiedProof | null;
    get identityPublicKey(): Buffer;
    bootstrap(device: Buffer): Promise<Buffer>;
  }
}

declare module "keet-identity-key/lib/encoding.js" {
  import type { Codec } from "compact-encoding";

  export interface DeviceAttestation {
    readonly publicKey: Buffer;
    readonly signature: Buffer;
  }

  export interface Proof {
    readonly version: number;
    readonly epoch: number;
    readonly identity: Buffer | null;
    readonly chain: ReadonlyArray<DeviceAttestation>;
    readonly data: { readonly signature: Buffer } | null;
  }

  export const ProofEncoding: Codec<Proof>;
  export const ReceiptEncoding: Codec<{ epoch: number }>;
}
