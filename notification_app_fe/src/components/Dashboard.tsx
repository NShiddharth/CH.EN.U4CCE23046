import React, { useEffect, useState } from 'react';
import { logger } from '../api';

export const Dashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logger.log('frontend', 'info', 'component', 'Dashboard component mounted');
    
    const fetchNotifications = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications([
          { id: 1, text: 'System update scheduled', priority: 'low' },
          { id: 2, text: 'New login detected', priority: 'medium' }
        ]);
        logger.log('frontend', 'debug', 'api', 'Fetched notifications successfully');
      } catch (err) {
        setError('Failed to load notifications');
        logger.log('frontend', 'error', 'api', 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <h2>Recent Notifications</h2>
      {notifications.map(n => (
        <div key={n.id} className={`notification-item priority-${n.priority}`}>
          {n.text}
        </div>
      ))}
    </div>
  );
};
