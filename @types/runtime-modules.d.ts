declare module 'bare-path' {
  const path: {
    readonly basename: (path: string, suffix?: string) => string
    readonly dirname: (path: string) => string
    readonly isAbsolute: (path: string) => boolean
    readonly join: (...paths: ReadonlyArray<string>) => string
    readonly relative: (from: string, to: string) => string
    readonly resolve: (...paths: ReadonlyArray<string>) => string
    readonly sep: string
  }
  export default path
}

declare module '*.wasm' {
  const path: string
  export default path
}

declare module '*.sql' {
  const text: string
  export default text
}
