import 'dotenv/config';

export default {
  expo: {
    name: 'VDAB Unofficial',
    slug: 'vdab-unofficial',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.vdab.unofficial'
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff'
      },
      package: 'com.vdab.unofficial'
    },
    scheme: 'vdab-unofficial',
    extra: {
      groqApiKey: process.env.GROQ_API_KEY,
      eas: {
        projectId: "your-project-id"
      }
    },
    plugins: [
      'expo-router'
    ]
  },
}; 