declare module "protomux-wakeup" {
  export interface WakeupSession {
    active(): void;
    inactive(): void;
    destroy(): void;
  }

  // One instance per process: sessions (topics) and streams must live on the
  // same instance for wakeup channels to pair.
  export default class Wakeup {
    constructor(onwakeup?: (id: Buffer, stream: unknown) => void);
    addStream(stream: unknown): void;
    session(
      capability: Buffer,
      handlers?: Record<string, unknown>,
    ): WakeupSession;
    destroy(): void;
  }
}
