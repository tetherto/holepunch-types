declare module "@tetherto/qvac-lib-stats-system" {
  interface GpuDevice {
    name: string;
    videoMemoryBytes: number;
  }

  interface FullSystemStats {
    os: { name: string; version: string };
    product: { vendor: string; name: string; version: string };
    cpu: {
      architecture: string;
      model: string;
      features: ReadonlyArray<string>;
      coreCount: number;
    };
    memory: { totalBytes: number; availableBytes: number };
    gpu: { devices: ReadonlyArray<GpuDevice> };
  }

  const statsSystem: {
    getFullSystemStats: () => FullSystemStats;
  };

  export default statsSystem;
}
