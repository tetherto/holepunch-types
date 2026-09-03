declare module "hypercore-id-encoding" {
  const idEncoding: {
    encode(key: Buffer): string;
    decode(id: string | Buffer): Buffer;
    normalize(any: string | Buffer): string;
    isValid(any: unknown): boolean;
  };
  export default idEncoding;
}
