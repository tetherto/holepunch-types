// bare-media ships no types. `image` is a callable — image(input) starts the
// fluent pipeline — with the low-level helpers hung off it as properties
// (`image.decode = decode`, `image.encode = encode`, ... in src/image.js).
// TypeScript infers only the call signature from the untyped JS, so those
// properties have to be declared here or every `image.decode(...)` call fails
// to compile.
declare module 'bare-media' {
  // A still image decodes to one Rgba; the animated formats (webp, gif) decode
  // through bare-media's animated path and carry a frames[] array instead —
  // even for a single-frame still.
  export interface Rgba {
    width: number
    height: number
    data: Uint8Array
    frames?: Rgba[]
  }

  export interface ImagePipeline {
    decode(): ImagePipeline
    orientate(): ImagePipeline
    resize(opts: { maxWidth?: number; maxHeight?: number }): ImagePipeline
    encode(opts: { mimetype: string }): Promise<Uint8Array>
  }

  export const image: {
    // the pipeline entry point takes encoded bytes, a path, or an already
    // decoded frame
    (input: Uint8Array | string | Rgba): ImagePipeline
    decode(input: Uint8Array, opts?: { maxFrames?: number }): Promise<Rgba>
    orientate(rgba: Rgba, opts: { file: Uint8Array }): Promise<Rgba>
    resize(rgba: Rgba, opts: { maxWidth?: number; maxHeight?: number }): Promise<Rgba>
    encode(rgba: Rgba, opts: { mimetype: string }): Promise<Uint8Array>
  }
}
