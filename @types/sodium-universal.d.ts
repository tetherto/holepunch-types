declare module "sodium-universal" {
  const sodium: {
    readonly crypto_secretbox_KEYBYTES: number;
    readonly crypto_secretbox_NONCEBYTES: number;
    readonly crypto_secretbox_MACBYTES: number;
    crypto_secretbox_easy(ciphertext: Buffer, message: Buffer, nonce: Buffer, key: Buffer): void;
    crypto_secretbox_open_easy(
      message: Buffer,
      ciphertext: Buffer,
      nonce: Buffer,
      key: Buffer,
    ): boolean;
    randombytes_buf(buffer: Buffer): void;
  };
  export default sodium;
}
