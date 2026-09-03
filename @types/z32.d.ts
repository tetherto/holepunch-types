declare module "z32" {
  export function encode(buf: Uint8Array): string;
  export function decode(s: string, out?: Uint8Array): Buffer;
}
