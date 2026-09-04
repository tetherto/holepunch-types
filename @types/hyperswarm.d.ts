declare module 'hyperswarm' {
  import type { EventEmitter } from 'node:events'
  import type { Duplex } from 'node:stream'

  export interface SwarmTopic {
    flushed(): Promise<void>
  }

  // The per-topic discovery behind the sessions swarm.join hands out.
  export interface PeerDiscovery {
    flushed(): Promise<boolean>
    refresh(): Promise<boolean>
  }

  export interface NetworkHealth {
    readonly online: boolean
    readonly degraded: boolean
    readonly cold: boolean
    readonly idle: boolean
    readonly responses: number
    readonly timeouts: number
    readonly timeoutsRate: number
  }

  export type BootstrapNode = {
    readonly host: string
    readonly port: number
  }

  // Returns the blind-relay public keys to relay connections through when a
  // direct hole-punch fails. Hyperswarm calls this per connection attempt, so
  // a lazy reader (e.g. `() => swarmconf.current.blindRelays`) picks up relays
  // as the config core syncs without recreating the swarm.
  export type RelayThrough = () => ReadonlyArray<Buffer>

  export type KeyPair = {
    readonly publicKey: Buffer
    readonly secretKey: Buffer
  }

  export type PeerInfo = {
    readonly topics: ReadonlyArray<Buffer>
    on(event: 'topic', listener: (topic: Buffer) => void): void
    off(event: 'topic', listener: (topic: Buffer) => void): void
  }

  export default class Hyperswarm extends EventEmitter {
    constructor(opts?: {
      readonly bootstrap?: ReadonlyArray<BootstrapNode> | undefined
      readonly relayThrough?: RelayThrough | undefined
      // Stable Noise identity. Without it hyperswarm mints a random keypair
      // per construction — peers would see a new key every restart.
      readonly keyPair?: KeyPair | undefined
    })
    readonly connections: Set<Duplex>
    // Connected peers keyed by hex public key; PeerInfo carries the Noise key.
    readonly peers: Map<string, { readonly publicKey: Buffer }>
    // HyperDHT node. `online` is the dht-rpc NetworkHealth verdict: starts
    // true, flips false after sustained zero-response ticks, holds its last
    // value while the node is idle or cold. The rest are debug/stats internals.
    readonly dht: {
      readonly online: boolean
      readonly degraded: boolean
      readonly host: string | null
      readonly port: number | null
      readonly _tick: number
      readonly nodes: ReadonlyArray<unknown>
      readonly stats: Record<string, unknown>
      readonly config: Record<string, unknown>
      readonly health: { stats: NetworkHealth }
      localAddress(): { readonly host: string; readonly port: number } | null
      remoteAddress(): { readonly host: string; readonly port: number } | null
      toArray(opts?: { readonly limit?: number }): ReadonlyArray<{
        readonly host: string
        readonly port: number
      }>
      addNode(node: { readonly host: string; readonly port: number }): void
      on(event: string, listener: (...args: ReadonlyArray<unknown>) => void): void
    }
    join(topic: Buffer, opts?: { readonly server?: boolean; readonly client?: boolean }): SwarmTopic
    leave(topic: Buffer): Promise<void>
    topics(): IterableIterator<PeerDiscovery>
    suspend(opts?: { readonly log?: (msg: string) => void }): Promise<void>
    resume(opts?: { readonly log?: (msg: string) => void }): Promise<void>
    destroy(): Promise<void>
  }
}
