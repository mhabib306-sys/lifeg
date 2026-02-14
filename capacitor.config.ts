import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homebase.app',
  appName: 'Homebase',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'accounts.google.com',
      'homebase-880f0.firebaseapp.com',
    ],
  },
  ios: {
    scheme: 'Homebase',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    StatusBar: {
      style: 'DEFAULT',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'none',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
