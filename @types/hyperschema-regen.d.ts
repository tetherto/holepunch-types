declare module "hyperschema-regen" {
  interface TagOptions {
    readonly tag?: string;
  }

  interface Regen {
    // rewinds the spec folder to a release so a regen is a clean diff, not an additive one
    checkout(spec?: string, opts?: TagOptions): void;
    // throws on the first collection whose id, version or index list moved
    validate(...targets: Array<string | TagOptions>): void;
    getPreviousRelease(): string;
  }

  const regen: Regen;
  export default regen;
}
