declare module 'localdrive' {
  import type { Writable } from 'streamx'

  interface LocaldriveEntry {
    key: string
    value: {
      executable: boolean
      linkname: string | null
      blob: { byteLength: number } | null
      metadata: unknown
    }
    mtime?: number
  }

  export default class Localdrive {
    constructor(
      root: string,
      opts?: {
        followLinks?: boolean
        atomic?: boolean
        roots?: Record<string, string>
      }
    )
    readonly root: string
    entry(key: string, opts?: { follow?: boolean }): Promise<LocaldriveEntry | null>
    get(key: string, opts?: { follow?: boolean }): Promise<Buffer | null>
    put(key: string, buffer: Uint8Array, opts?: { executable?: boolean }): Promise<void>
    createReadStream(
      key: string,
      opts?: { start?: number; end?: number; length?: number; follow?: boolean }
    ): AsyncIterable<Buffer>
    createWriteStream(key: string, opts?: { executable?: boolean }): Writable
    del(key: string): Promise<void>
    symlink(key: string, linkname: string): Promise<void>
    readdir(folder?: string): AsyncIterable<string>
    list(
      folder?: string,
      opts?: { ignore?: string | string[] | ((key: string) => boolean) }
    ): AsyncIterable<LocaldriveEntry>
  }
}
