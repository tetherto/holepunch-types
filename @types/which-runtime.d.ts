declare module 'which-runtime' {
  export const runtime: 'bare' | 'node' | 'browser' | 'unknown'
  export const version: string
  export const platform: string
  export const arch: string
  export const isBare: boolean
  export const isBareKit: boolean
  export const isPear: boolean
  export const isNode: boolean
  export const isBrowser: boolean
  export const isWindows: boolean
  export const isLinux: boolean
  export const isMac: boolean
  export const isIOS: boolean
  export const isAndroid: boolean
  export const isElectron: boolean
  export const isElectronRenderer: boolean
  export const isElectronWorker: boolean
}
