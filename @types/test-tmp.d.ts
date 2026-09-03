declare module "test-tmp" {
  import type { Test } from "brittle";

  export default function tmp(
    t?: Test | null,
    opts?: { dir?: string | null; name?: string | null; order?: number; force?: boolean },
  ): Promise<string>;
}
