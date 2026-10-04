import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.absher.app',

  appName: 'Absher',

  webDir: 'dist',

  plugins: {
    CapacitorPasskey: {
      origin: 'https://absher-client.vercel.app',
      domains: ['absher-client.vercel.app'],
      autoShim: true,
    },
  },
};

export default config;