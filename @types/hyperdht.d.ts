declare module "hyperdht/testnet.js" {
  export type BootstrapNode = { readonly host: string; readonly port: number };

  export class Testnet {
    readonly bootstrap: ReadonlyArray<BootstrapNode>;
    destroy(): Promise<void>;
  }

  // A local, ephemeral DHT of `size` nodes for tests — no real network
  // bootstrap needed. `opts.teardown` (e.g. brittle's t.teardown) tears it
  // down automatically.
  export default function createTestnet(
    size?: number,
    opts?: { readonly teardown?: (fn: () => unknown) => void },
  ): Promise<Testnet>;
}
