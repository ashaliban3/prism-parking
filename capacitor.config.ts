import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ashaliban.prismparking',
  appName: 'Prism Parking',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
