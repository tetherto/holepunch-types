declare module "scope-lock" {
  export default class ScopeLock {
    constructor(options?: { readonly debounce?: boolean });
    readonly locked: boolean;
    lock(): Promise<boolean>;
    unlock(): void;
    flush(): Promise<boolean>;
    destroy(): void;
  }
}
