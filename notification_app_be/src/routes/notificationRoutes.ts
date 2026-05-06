import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { NotificationService } from '../services/notificationService';
import { SchedulerService } from '../services/schedulerService';
import { Logger } from 'logging_middleware';

export function createNotificationRoutes(logger: Logger) {
  const router = Router();
  
  const notificationService = new NotificationService(logger);
  const schedulerService = new SchedulerService(logger);
  const controller = new NotificationController(notificationService, schedulerService);

  router.get('/', controller.getNotifications);
  router.post('/schedule', controller.scheduleMaintenance);

  return router;
}
