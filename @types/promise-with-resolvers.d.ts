// ES2024, and both Bare and Node ship it. Declared here so a consumer compiling this workspace
// against an older `lib` (app-runtime targets ES2022) still sees the shape.
interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

interface PromiseConstructor {
  withResolvers<T>(): PromiseWithResolvers<T>;
}
