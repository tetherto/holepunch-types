declare module "suspendify" {
  export interface SuspendifyOptions {
    readonly suspend?: () => Promise<void> | void;
    readonly resume?: () => Promise<void> | void;
    readonly presuspend?: () => Promise<void> | void;
    readonly suspendCancelled?: (afterWakeup: boolean) => Promise<void> | void;
    readonly wakeup?: () => Promise<void> | void;
    readonly pollLinger?: () => Promise<number> | number;
    readonly wakeupLinger?: number;
  }

  export default class Suspendify {
    constructor(opts?: SuspendifyOptions);
    readonly interrupted: boolean;
    readonly suspended: boolean;
    readonly resumed: boolean;
    readonly suspending: boolean;
    readonly resuming: boolean;
    suspend(linger?: number): Promise<void>;
    resume(): Promise<void>;
    resuspend(linger?: number): Promise<void>;
    wakeup(): Promise<void>;
    waitForResumed(): Promise<void>;
    update(): Promise<void>;
  }
}
