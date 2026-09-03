declare module "ready-guard" {
  export default class ReadyGuard {
    readonly entered: boolean;
    readonly opened: boolean;
    readonly destroyed: boolean;
    ready(): Promise<void>;
    enter(): boolean;
    exit(): void;
    destroy(error?: Error): void;
  }
}
