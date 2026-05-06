import { Logger } from 'logging_middleware';

export interface Notification {
  id: string;
  placement: number; // Lower is higher priority
  result: number;    // Lower is higher priority
  event: number;     // Lower is higher priority
  message: string;
  timestamp: Date;
}

export class NotificationService {
  constructor(private logger: Logger) {}

  /**
   * Priority Logic: Placement > Result > Event > Timestamp
   */
  public sortNotifications(notifications: Notification[]): Notification[] {
    this.logger.log('backend', 'debug', 'service', 'Sorting notifications using priority algorithm');
    
    return [...notifications].sort((a, b) => {
      if (a.placement !== b.placement) return a.placement - b.placement;
      if (a.result !== b.result) return a.result - b.result;
      if (a.event !== b.event) return a.event - b.event;
      return b.timestamp.getTime() - a.timestamp.getTime(); // Latest first for same priority
    });
  }

  public getPriorityInbox(notifications: Notification[], limit: number = 10): Notification[] {
    const sorted = this.sortNotifications(notifications);
    return sorted.slice(0, limit);
  }
}
