declare module 'bare-inspector' {
  import type { Readable } from 'bare-stream'

  export class Session {
    connect(): void
    post(method: string, params?: Record<string, unknown>): Promise<unknown>
    destroy(): void
    on(event: string, listener: (message: unknown) => void): void
    on(event: 'inspectorNotification', listener: (message: unknown) => void): void
  }

  export class HeapSnapshot extends Readable {
    constructor(session: Session)
  }
}
