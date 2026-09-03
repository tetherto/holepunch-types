declare module 'compact-encoding' {
  export interface State {
    start: number
    end: number
    buffer: Uint8Array | null
  }

  export interface Codec<T> {
    preencode(state: State, value: T): void
    encode(state: State, value: T): void
    decode(state: State): T
  }

  // exports.string is exports.utf8, and the chained assignment hides both from inference
  export const utf8: Codec<string>

  export function encode<T>(codec: Codec<T>, value: T): Uint8Array
  export function decode<T>(codec: Codec<T>, buffer: Uint8Array): T
}
