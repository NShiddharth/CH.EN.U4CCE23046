import { validateLogParams } from './validator';
import { LogLevel, LogPackage, LogStack } from './types';
import { EvaluationApiClient } from './apiClient';

export class Logger {
  private apiClient: EvaluationApiClient;

  constructor(apiClient: EvaluationApiClient) {
    this.apiClient = apiClient;
  }

  public log(stack: LogStack, level: LogLevel, pkg: LogPackage, message: string): void {
    if (!validateLogParams(stack, level, pkg)) {
      console.warn(`[Logger] Invalid parameters: stack=${stack}, level=${level}, package=${pkg}. Log dropped.`);
      return;
    }

    const payload = { stack, level, package: pkg, message };
    
    // Asynchronous processing (fire and forget pattern for logs)
    this.apiClient.sendLogs(payload).catch(err => {
      console.error('[Logger] Unhandled error during async logging', err);
    });
  }
}
