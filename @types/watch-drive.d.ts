declare module "watch-drive" {
  interface WatchDiffEntry {
    type: "update" | "delete";
    key: string;
  }

  interface WatchBatch {
    key: string;
    length: number;
    fork: number;
    diff: WatchDiffEntry[];
  }

  interface WatchStream extends AsyncIterable<WatchBatch> {
    destroy(err?: Error): void;
    once(event: string, listener: (...args: unknown[]) => void): void;
  }

  // Watch a Hyperdrive or Localdrive under `prefix` and get the diff of each change.
  export default function watch(drive: unknown, prefix?: string): WatchStream;
}
