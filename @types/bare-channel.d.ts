declare module 'bare-channel' {
  class Port {
    read(): Promise<unknown>
    write(value: unknown): Promise<void>
    close(): Promise<void>
  }
  export default class Channel {
    constructor()
    readonly handle: unknown
    connect(): Port
    static from(handle: unknown): Channel
  }
}
