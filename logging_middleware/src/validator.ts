import { LogStack, LogLevel, LogPackage } from './types';

const VALID_STACKS: Set<string> = new Set(['backend', 'frontend']);
const VALID_LEVELS: Set<string> = new Set(['debug', 'info', 'warn', 'error', 'fatal']);

const VALID_BACKEND_PACKAGES = new Set(['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service']);
const VALID_FRONTEND_PACKAGES = new Set(['api', 'component', 'hook', 'page', 'state', 'style']);
const VALID_COMMON_PACKAGES = new Set(['auth', 'config', 'middleware', 'utils']);

export function validateLogParams(stack: any, level: any, pkg: any): boolean {
  if (!VALID_STACKS.has(stack)) return false;
  if (!VALID_LEVELS.has(level)) return false;

  if (stack === 'backend') {
    if (!VALID_BACKEND_PACKAGES.has(pkg) && !VALID_COMMON_PACKAGES.has(pkg)) return false;
  } else if (stack === 'frontend') {
    if (!VALID_FRONTEND_PACKAGES.has(pkg) && !VALID_COMMON_PACKAGES.has(pkg)) return false;
  }

  return true;
}
