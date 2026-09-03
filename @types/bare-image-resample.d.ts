declare module "bare-image-resample" {
  export interface ResampleImage {
    width: number;
    height: number;
    data: Uint8Array;
  }

  // the result carries the caller's own image shape, minus the resampled pixels
  export function resize<T extends ResampleImage>(
    image: T,
    width: number,
    height: number,
  ): T;
}
