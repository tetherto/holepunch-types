declare module 'blind-peering' {
  import type Wakeup from 'protomux-wakeup'

  export interface BlindPeerChannel {
    readonly stream?: {
      readonly userData?: ReadonlyArray<{
        readonly userData?: {
          readonly stats?: { readonly wireData?: { readonly tx?: number } }
        }
      }> | null
    } | null
  }

  export interface BlindPeerConnection {
    readonly remotePublicKey: Buffer
    readonly connected: boolean
    readonly connects: number
    readonly channel?: BlindPeerChannel | null
  }

  export default class BlindPeering {
    constructor(
      dht: unknown,
      store: import('corestore').default,
      opts?: {
        readonly pick?: number
        readonly suspended?: boolean
        readonly batchIdleWait?: number
        readonly batchMaxWait?: number
        readonly wakeup?: Wakeup | null
      }
    )
    readonly blindPeers: Map<string, BlindPeerConnection>
    addAutobaseBackground<T>(
      auto: import('autobee').default<T>,
      opts?: {
        readonly target?: Buffer
        readonly keys?: ReadonlyArray<Buffer>
      }
    ): void
    addCoreBackground(
      core: unknown,
      opts?: {
        readonly target?: Buffer
        readonly keys?: ReadonlyArray<Buffer>
        readonly announce?: boolean
      }
    ): void
    suspend(): Promise<void>
    resume(): Promise<void>
    close(): Promise<void>
  }
}
