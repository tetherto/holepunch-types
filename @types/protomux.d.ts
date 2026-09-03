declare module 'protomux' {
  // Duck-typed, not node:stream's Duplex — protomux runs over any duplex-like
  // stream (streamx, bare-sidecar's IPC, node:stream).
  export type MuxStream = unknown

  export interface ChannelOpts {
    protocol: string
    id?: Buffer
    onopen?: () => void
    onclose?: () => void
  }

  export interface MessageOpts {
    encoding: unknown
    onmessage: (data: Buffer) => void
  }

  export interface Message {
    send(data: Buffer): void
  }

  export interface Channel {
    open(): void
    close(): void
    addMessage(opts: MessageOpts): Message
  }

  export default class Protomux {
    static from(stream: MuxStream): Protomux
    createChannel(opts: ChannelOpts): Channel | null
  }
}

declare module 'compact-encoding' {
  export interface State {
    start: number
    end: number
    buffer: Buffer | null
  }

  export interface Encoding<T> {
    preencode(state: State, value: T): void
    encode(state: State, value: T): void
    decode(state: State): T
  }

  export const raw: Encoding<Buffer>
  export const uint: Encoding<number>
  export const fixed32: Encoding<Buffer>

  export function encode<T>(enc: Encoding<T>, value: T): Buffer
  export function decode<T>(enc: Encoding<T>, buffer: Buffer): T
}
