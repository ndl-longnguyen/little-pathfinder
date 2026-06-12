import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.littlepathfinder.animalrescue',
  appName: 'Animal Rescue Adventure',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
