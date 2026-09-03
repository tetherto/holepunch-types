declare module '@tetherto/swarmconf' {
  import type HyperConf from 'hyperconf'

  export interface SwarmConfig {
    readonly blindRelays: ReadonlyArray<Buffer>
  }

  // Reactive swarm configuration backed by a hypercore in the supplied
  // Corestore. `current.blindRelays` is the list of blind-relay public keys
  // (32-byte buffers) used for NAT traversal — it populates after `ready()`
  // resolves and updates in place as the config core syncs.
  export default class Swarmconf extends HyperConf<SwarmConfig> {
    // `store` is a Corestore instance. Typed as `unknown` to avoid coupling
    // this ambient declaration to the `corestore` module shape.
    constructor(store: unknown)
  }
}
