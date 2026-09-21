import { registerPlugin } from '@capacitor/core';

interface SystemBarsPlugin {
  setImmersive(options: {
    enabled: boolean;
  }): Promise<{
    enabled: boolean;
  }>;
}

const SystemBars = registerPlugin<SystemBarsPlugin>('SystemBars');

export default SystemBars;