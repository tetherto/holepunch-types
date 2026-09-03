declare module "process-top" {
  // Per-process CPU/memory/event-loop snapshot. `toJSON()` returns the plain
  // stats object surfaced through the engine's debug state.
  export default class Top {
    toJSON(): Record<string, unknown>;
  }
}
