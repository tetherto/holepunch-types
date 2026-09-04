declare module 'rocksdb-native' {
  // The native binding takes ints, not names; mirrors rocksdb-native/lib/constants.js.
  export const constants: {
    readonly pinningTier: {
      readonly NONE: 0
      readonly FLUSHED_AND_SIMILAR: 1
      readonly ALL: 2
    }
    readonly garbageCollectionPolicy: {
      readonly DEFAULT: 0
      readonly FORCE: 1
      readonly DISABLE: 2
    }
    readonly bottommostLevelCompaction: {
      readonly NONE: 0
      readonly SKIP: 1
      readonly FORCE: 2
    }
    readonly walRecoveryMode: {
      readonly TOLERATE_CORRUPTED_TAIL_RECORDS: 0
      readonly ABSOLUTE_CONSISTENCY: 1
      readonly POINT_IN_TIME: 2
      readonly SKIP_ANY_CORRUPTED_RECORDS: 3
    }
    readonly statsLevel: {
      readonly DISABLE_ALL: 0
      readonly EXCEPT_HISTOGRAM_OR_TIMERS: 1
      readonly EXCEPT_TIMERS: 2
      readonly EXCEPT_DETAILED_TIMERS: 3
      readonly EXCEPT_TIME_FOR_MUTEX: 4
      readonly ALL: 5
    }
    readonly walFileType: {
      readonly ARCHIVED: 0
      readonly ALIVE: 1
    }
  }

  type Values<T> = T[keyof T]

  export type GarbageCollectionPolicy = Values<typeof constants.garbageCollectionPolicy>
  export type BottommostLevelCompaction = Values<typeof constants.bottommostLevelCompaction>
}
