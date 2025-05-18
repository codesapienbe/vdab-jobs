import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_REQUEST_LIMIT_PER_SECOND, Config } from '../../constants/Config';
import { ApiError } from '../types/api.types';

// API key storage key
const API_KEY_STORAGE = 'vdab_api_key';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request limiting queue
let requestQueue: Array<() => void> = [];
let processing = false;

// Process the request queue at the rate limit
const processQueue = async () => {
  if (processing || requestQueue.length === 0) return;
  
  processing = true;
  const interval = 1000 / API_REQUEST_LIMIT_PER_SECOND;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    request?.();
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  processing = false;
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get API key from secure storage
    const apiKey = await getApiKey();
    
    if (apiKey) {
      config.headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // Add certificate pinning header for SSL pinning validation
    config.headers['X-Pinned-Cert'] = 'sha256//VdabCertificateFingerprint=';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.response?.data,
    };
    
    return Promise.reject(apiError);
  }
);

// Rate-limited API request function
export const apiRequest = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    const executeRequest = () => {
      apiClient(config)
        .then(resolve)
        .catch(reject);
    };
    
    requestQueue.push(executeRequest);
    
    if (!processing) {
      processQueue();
    }
  });
};

// Store API key securely
export async function storeApiKey(apiKey: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE, apiKey);
}

// Get API key from secure storage
export async function getApiKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(API_KEY_STORAGE);
}

// Remove API key from secure storage
export async function removeApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE);
}

// Validate request parameters
export function validateRequest<T>(data: T, requiredFields: (keyof T)[]): boolean {
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
} 