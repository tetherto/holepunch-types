declare module 'hypercore-crypto' {
  export type KeyPair = {
    readonly publicKey: Buffer
    readonly secretKey: Buffer
  }

  export function keyPair(seed?: Buffer): KeyPair
  export function discoveryKey(publicKey: Buffer): Buffer
  export function hash(values: Buffer | string | Array<Buffer | string>): Buffer
  export function randomBytes(length: number): Buffer
  export function sign(message: Buffer, secretKey: Buffer): Buffer
  export function verify(message: Buffer, signature: Buffer, publicKey: Buffer): boolean
  // Always returns exactly `count` buffers; literal overloads keep each element typed Buffer.
  export function namespace(name: Buffer | string, count: 1): [Buffer]
  export function namespace(name: Buffer | string, count: 2): [Buffer, Buffer]
  export function namespace(name: Buffer | string, count: 3): [Buffer, Buffer, Buffer]
  export function namespace(name: Buffer | string, count: number): [Buffer, ...Array<Buffer>]

  const crypto: {
    keyPair(seed?: Buffer): KeyPair
    discoveryKey(publicKey: Buffer): Buffer
    hash(values: Buffer | string | Array<Buffer | string>): Buffer
    randomBytes(length: number): Buffer
    sign(message: Buffer, secretKey: Buffer): Buffer
    verify(message: Buffer, signature: Buffer, publicKey: Buffer): boolean
    namespace(name: Buffer | string, count: 1): [Buffer]
    namespace(name: Buffer | string, count: 2): [Buffer, Buffer]
    namespace(name: Buffer | string, count: 3): [Buffer, Buffer, Buffer]
    namespace(name: Buffer | string, count: number): [Buffer, ...Array<Buffer>]
  }
  export default crypto
}
