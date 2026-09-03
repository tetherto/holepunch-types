declare module 'safety-catch' {
  /** Rethrows real bugs asynchronously; swallows benign teardown rejections. */
  export default function safetyCatch(error: unknown): void
}
