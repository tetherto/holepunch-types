// Ambient type declarations for upstream `bare-sqlite-vector`
// (holepunchto/bare-sqlite-vector). Registers the sqlite-vector SQL surface
// against an open `bare-sqlite` connection.

declare module 'bare-sqlite-vector' {
  import type { DatabaseSync } from 'bare-sqlite'

  export function register(db: DatabaseSync): void
}
