import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { EvaluationApiClient, Logger } from 'logging_middleware';
import { createNotificationRoutes } from './routes/notificationRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for auth
const memoryStorage = new Map<string, string>();
const storage = {
  get: (key: string) => memoryStorage.get(key) || null,
  set: (key: string, value: string) => memoryStorage.set(key, value)
};

// Initialize Evaluation Client and Logger
const evaluationClient = new EvaluationApiClient({
  baseUrl: process.env.EVALUATION_SERVICE_URL || 'http://localhost:8080',
  credentials: {
    email: process.env.EVAL_EMAIL || 'ch.en.u4cce23046@ch.students.amrita.edu',
    name: process.env.EVAL_NAME || 'N SHIDDHARTH',
    mobileNo: process.env.EVAL_MOBILE || '8072889480',
    githubUsername: process.env.EVAL_GITHUB || 'NShiddharth',
    rollNo: process.env.EVAL_ROLL_NO || 'CH.EN.U4CCE23046',
    accessCode: process.env.EVAL_ACCESS_CODE || 'PTBMmQ'
  },
  storage
});

const logger = new Logger(evaluationClient);

// WebSocket logic
io.on('connection', (socket) => {
  logger.log('backend', 'info', 'service', `New WebSocket client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.log('backend', 'info', 'service', `Client disconnected: ${socket.id}`);
  });
});

// Start background registration
evaluationClient.ensureAuthenticated()
  .then(() => console.log('Successfully connected to Evaluation Service'))
  .catch(err => console.error('Failed to connect to Evaluation Service', err));

// Middleware
app.use((req, res, next) => {
  (req as any).logger = logger;
  next();
});

// Routes
app.use('/api/notifications', createNotificationRoutes(logger));

app.get('/health', (req, res) => res.status(200).send('OK'));

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  logger.log('backend', 'info', 'utils', `Server started on port ${port}`);
});
