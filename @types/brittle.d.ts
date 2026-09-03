declare module "brittle" {
  export interface Test {
    ok(assertion: unknown, message?: string): boolean;
    absent(assertion: unknown, message?: string): boolean;
    is(actual: unknown, expected: unknown, message?: string): boolean;
    not(actual: unknown, expected: unknown, message?: string): boolean;
    alike(actual: unknown, expected: unknown, message?: string): boolean;
    unlike(actual: unknown, expected: unknown, message?: string): boolean;
    exception: {
      (
        fn: (() => unknown) | Promise<unknown>,
        expectedError?: RegExp | string | Error,
        message?: string,
      ): Promise<void>;
      all(
        fn: (() => unknown) | Promise<unknown>,
        expectedError?: RegExp | string | Error,
        message?: string,
      ): Promise<void>;
    };
    execution(
      fn: (() => unknown) | Promise<unknown>,
      message?: string,
    ): Promise<void>;
    pass(message?: string): boolean;
    fail(message?: string): boolean;
    comment(...message: unknown[]): void;
    plan(n: number): void;
    timeout(ms: number): void;
    teardown(fn: () => unknown, opts?: { order?: number }): void;
    test(name: string, fn: TestFn): void;
  }

  export type TestFn = (t: Test) => void | Promise<void>;

  export interface TestFunction {
    (name: string, fn: TestFn): void;
    (name: string, opts: Record<string, unknown>, fn: TestFn): void;
    solo: TestFunction;
    skip: TestFunction;
    configure(opts: Record<string, unknown>): void;
    pause(): void;
    resume(): void;
    load(url: string | URL): Promise<void>;
  }

  // A hook's teardown is deferred to the end of the run, not the end of a test.
  export const hook: TestFunction;

  const test: TestFunction;
  export default test;
}
