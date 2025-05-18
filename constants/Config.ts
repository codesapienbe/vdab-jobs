import Constants from 'expo-constants';

interface EnvVariables {
  VDAB_API_KEY: string;
  BASE_URL: string;
}

const defaultEnvVariables: EnvVariables = {
  VDAB_API_KEY: process.env.EXPO_PUBLIC_VDAB_API_KEY || '',
  BASE_URL: process.env.EXPO_PUBLIC_VDAB_BASE_URL || 'https://api.vdab.be/openservices',
};

export const Config: EnvVariables = {
  ...defaultEnvVariables,
  ...Constants.expoConfig?.extra,
};

export const API_REQUEST_LIMIT_PER_SECOND = 3; 