import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LogPayload } from './types';

export interface EvaluationCredentials {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}

export interface EvaluationClientConfig {
  baseUrl: string;
  credentials: EvaluationCredentials;
  storage: {
    get: (key: string) => string | null;
    set: (key: string, value: string) => void;
  };
}

export class EvaluationApiClient {
  private client: AxiosInstance;
  private config: EvaluationClientConfig;
  private isAuthenticating = false;
  private authPromise: Promise<void> | null = null;

  constructor(config: EvaluationClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl || (typeof process !== 'undefined' ? process.env.EVALUATION_SERVICE_URL : undefined) || 'http://localhost:8080',
      timeout: 10000,
    });

    this.client.interceptors.request.use(this.requestInterceptor);
    this.client.interceptors.response.use(
      (response) => response,
      this.responseErrorInterceptor
    );
  }

  private requestInterceptor = async (config: InternalAxiosRequestConfig) => {
    // Don't attach token for register and auth routes
    if (config.url?.includes('/register') || config.url?.includes('/auth')) {
      return config;
    }

    let token = this.config.storage.get('access_token');
    
    // If no token exists, try to authenticate first
    if (!token && !this.isAuthenticating) {
      await this.ensureAuthenticated();
      token = this.config.storage.get('access_token');
    } else if (!token && this.isAuthenticating && this.authPromise) {
      await this.authPromise;
      token = this.config.storage.get('access_token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };

  private responseErrorInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await this.ensureAuthenticated(true);
        const token = this.config.storage.get('access_token');
        if (token && originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }
        return this.client(originalRequest);
      } catch (authError) {
        return Promise.reject(authError);
      }
    }
    return Promise.reject(error);
  };

  public async ensureAuthenticated(force = false): Promise<void> {
    if (this.isAuthenticating) {
      return this.authPromise as Promise<void>;
    }

    this.isAuthenticating = true;
    this.authPromise = (async () => {
      try {
        let clientId = this.config.storage.get('clientID');
        let clientSecret = this.config.storage.get('clientSecret');

        if (!clientId || !clientSecret || force) {
          const regData = await this.register();
          clientId = regData.clientID;
          clientSecret = regData.clientSecret;
          this.config.storage.set('clientID', clientId);
          this.config.storage.set('clientSecret', clientSecret);
        }

        const authData = await this.authenticate(clientId!, clientSecret!);
        this.config.storage.set('access_token', authData.access_token);
        if (authData.token_type) {
           this.config.storage.set('token_type', authData.token_type);
        }
      } catch (error) {
        console.error('[EvaluationApiClient] Authentication flow failed:', error);
        throw error;
      } finally {
        this.isAuthenticating = false;
        this.authPromise = null;
      }
    })();

    return this.authPromise;
  }

  private async register(): Promise<{ clientID: string; clientSecret: string }> {
    try {
      const response = await this.client.post('/evaluation-service/register', {
        email: this.config.credentials.email,
        name: this.config.credentials.name,
        mobileNo: this.config.credentials.mobileNo,
        githubUsername: this.config.credentials.githubUsername,
        rollNo: this.config.credentials.rollNo,
        accessCode: this.config.credentials.accessCode
      });
      return response.data;
    } catch (error) {
      console.error('[EvaluationApiClient] Registration failed:', (error as AxiosError).message);
      throw error;
    }
  }

  private async authenticate(clientID: string, clientSecret: string): Promise<{ access_token: string, token_type?: string }> {
    try {
      const response = await this.client.post('/evaluation-service/auth', {
        email: this.config.credentials.email,
        name: this.config.credentials.name,
        rollNo: this.config.credentials.rollNo,
        accessCode: this.config.credentials.accessCode,
        clientID,
        clientSecret
      });
      return response.data;
    } catch (error) {
      console.error('[EvaluationApiClient] Authentication failed:', (error as AxiosError).message);
      throw error;
    }
  }

  async sendLogs(payload: LogPayload, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.client.post('/evaluation-service/logs', payload);
        return; // Success
      } catch (error) {
        if (i === retries - 1) {
          console.error('[EvaluationApiClient] Failed to send log to remote API after retries', (error as AxiosError).message);
        } else {
          // Exponential backoff retry handling
          await new Promise(res => setTimeout(res, Math.pow(2, i) * 100));
        }
      }
    }
  }
}
