# holepunch-types

Ambient TypeScript declarations for the [Holepunch](https://holepunch.to) / Bare
ecosystem modules that don't ship their own types, maintained as one shared
package so every consumer typechecks against the same shapes.

## Installation

```bash
npm install -D holepunch-types
```

## Usage

The declarations are ambient (`declare module '...'`), so they need to be part
of your program once. The lightest way is a single reference file included by
your `tsconfig.json`:

```ts
// types/ambient.d.ts
/// <reference types="holepunch-types" />
```

Alternatively, point `typeRoots` at the package:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./node_modules/holepunch-types"]
  }
}
```

Either way, imports of the covered modules are typed from then on:

```ts
import Corestore from 'corestore'
import Hyperswarm from 'hyperswarm'
import Hyperdrive from 'hyperdrive'
```

## Modules covered

`autobase` `autobee` `bare` `bare-channel` `bare-image-resample`
`bare-inspector` `bare-media` `bare-rpc` `bare-sidecar` `bare-sqlite-vector`
`bare-storage` `blind-pairing` `blind-peering` `brittle` `compact-encoding`
`corestore` `hyperbee` `hyperblobs` `hyperconf` `hypercore`
`hypercore-blob-server` `hypercore-crypto` `hypercore-id-encoding`
`hypercore-storage` `hyperdb` `hyperdht` `hyperdispatch` `hyperdrive`
`hyperschema-regen` `hyperswarm` `keet-identity-key` `localdrive`
`pear-interface` `process-top` `protomux` `protomux-wakeup` `rache`
`ready-guard` `rocksdb-native` `safety-catch` `scope-lock` `sodium-universal`
`suspendify` `test-tmp` `watch-drive` `which-runtime` `z32`

Plus a few ambient helpers: `@tetherto/swarmconf`,
`@tetherto/qvac-lib-stats-system`, `Bare` globals, `Promise.withResolvers`, and
`*.sql` / `*.wasm` module declarations.

Deliberately **not** covered: `ready-resource` (the module ships its own types)
and `b4a` (typed by `@types/b4a`).

## Scope and accuracy

These declarations are written against real usage, not exhaustively against
each module's API — treat a missing member as an invitation to add it. The
long-term goal is upstreaming the stable ones into the modules themselves; this
package is the shared staging ground until then.

## Contributing

Open a PR against `main`. Keep each module's declarations in its own
`@types/<module>.d.ts` and reference it from `@types/index.d.ts`.

## License

See [LICENSE](./LICENSE.md).
