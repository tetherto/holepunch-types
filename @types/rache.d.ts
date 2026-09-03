declare module 'rache' {
  // Shared LRU cache passed to corestore as globalCache.
  export default class Rache {
    constructor(opts?: { readonly maxSize?: number })
  }
}
