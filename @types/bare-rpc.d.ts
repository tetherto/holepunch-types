declare module 'bare-rpc' {
  // Duck-typed, not node:stream's Duplex — bare-rpc runs over any duplex-like
  // stream (streamx, bare-sidecar's IPC, node:stream), never introspecting it
  // beyond read/write.
  export type RPCStream = unknown
  export interface RPCIncomingStream {
    on(event: string, listener: (...args: unknown[]) => void): void
  }
  export interface RPCOutgoingStream {
    write(chunk: Buffer | string): boolean
    end(): void
    destroy(err?: Error): void
    on(event: string, listener: (...args: unknown[]) => void): void
  }

  export interface RPCOutgoingRequest {
    readonly command: number
    readonly sent: boolean
    readonly received: boolean
    send(data?: Buffer | string, encoding?: string): void
    reply(encoding?: string): Promise<Buffer>
    createRequestStream(opts?: unknown): RPCOutgoingStream
    createResponseStream(opts?: unknown): RPCIncomingStream
  }

  export interface RPCIncomingRequest {
    readonly command: number
    readonly data: Buffer | null
    readonly sent: boolean
    reply(data?: Buffer | string, encoding?: string): void
    createResponseStream(opts?: unknown): RPCOutgoingStream
    createRequestStream(opts?: unknown): RPCIncomingStream
  }

  export type OnRequest = (req: RPCIncomingRequest) => void

  export default class RPC {
    constructor(stream: RPCStream, onrequest?: OnRequest)
    request(command: number): RPCOutgoingRequest
    event(command: number, data?: Buffer): void
    static CommandRouter: typeof RPCCommandRouter
  }

  export class RPCCommandRouter {
    respond(
      command: number,
      handler: (req: RPCIncomingRequest, data: Buffer) => Buffer | Promise<Buffer>
    ): void
  }
}
