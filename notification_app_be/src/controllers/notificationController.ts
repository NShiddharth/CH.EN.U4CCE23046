import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { SchedulerService } from '../services/schedulerService';

export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private schedulerService: SchedulerService
  ) {}

  public getNotifications = async (req: Request, res: Response) => {
    try {
      const logger = (req as any).logger;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Mock data - in real app would come from repository/DB
      const mockNotifications = [
        { id: '1', placement: 1, result: 2, event: 1, message: 'Critical Update', timestamp: new Date() },
        { id: '2', placement: 2, result: 1, event: 1, message: 'Normal Alert', timestamp: new Date() },
        { id: '3', placement: 1, result: 1, event: 2, message: 'System Maintenance', timestamp: new Date() },
      ];

      const priorityInbox = this.notificationService.getPriorityInbox(mockNotifications, limit);
      
      logger.log('backend', 'info', 'controller', `Returned ${priorityInbox.length} priority notifications`);
      res.json(priorityInbox);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

  public scheduleMaintenance = async (req: Request, res: Response) => {
    try {
      const logger = (req as any).logger;
      const { tasks, budget } = req.body;

      if (!tasks || budget === undefined) {
        return res.status(400).json({ error: 'Tasks and budget are required' });
      }

      const result = this.schedulerService.getOptimalSchedule(tasks, budget);
      
      logger.log('backend', 'info', 'controller', `Maintenance scheduled successfully`);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Optimization failed' });
    }
  };
}
