declare namespace Bare {
  const IPC: import('node:stream').Duplex
  const suspended: boolean
  // mutable: on bare-kit argv[0] is the channel @qvac/sdk reads its HOME_DIR from
  const argv: Array<string>
  // Native threads. terminate() is a request the thread honors at a safepoint —
  // it does NOT stop a busy-spinning thread, and join() on one blocks forever.
  class Thread {
    constructor(filename: string, options?: { readonly data?: unknown })
    readonly joined: boolean
    join(): void
    terminate(): void
    static readonly isMainThread: boolean
    // Present only inside a spawned thread; null/undefined on the main thread.
    static readonly self: { readonly data: unknown } | null
  }
  function exit(code?: number): never
  function idle(): void
  function on(event: 'suspend', listener: (linger: number | (() => number)) => void): void
  function on(event: 'wakeup', listener: () => void): void
  function on(event: 'idle', listener: () => void): void
  function on(event: 'resume', listener: () => void): void
  function on(
    event: 'unhandledRejection',
    listener: (reason: unknown, promise: Promise<unknown>) => void
  ): void
  function on(event: 'uncaughtException', listener: (err: Error) => void): void
  // Fallback: a caller holding a union of the above event names (rather than
  // a single literal) needs a signature that accepts it. `any[]`, not
  // `unknown[]`, so a specific listener (e.g. `(err: Error) => void`) stays assignable.
  // biome-ignore lint/suspicious/noExplicitAny: keeps specific listeners assignable
  function on(event: string, listener: (...args: any[]) => void): void
  // biome-ignore lint/suspicious/noExplicitAny: keeps specific listeners assignable
  function off(event: string, listener: (...args: any[]) => void): void
}
