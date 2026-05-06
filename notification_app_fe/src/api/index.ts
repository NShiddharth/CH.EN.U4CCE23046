import { EvaluationApiClient, Logger } from 'logging_middleware';

export const storage = {
  get: (key: string) => localStorage.getItem(key),
  set: (key: string, value: string) => localStorage.setItem(key, value)
};

export const evaluationClient = new EvaluationApiClient({
  baseUrl: (import.meta as any).env.VITE_EVALUATION_SERVICE_URL || 'http://localhost:8080',
  credentials: {
    email: 'ch.en.u4cce23046@ch.students.amrita.edu',
    name: 'N SHIDDHARTH',
    mobileNo: '8072889480',
    githubUsername: 'NShiddharth',
    rollNo: 'CH.EN.U4CCE23046',
    accessCode: 'PTBMmQ'
  },
  storage
});

export const logger = new Logger(evaluationClient);
