import React, { useEffect, useState } from 'react';
import { logger } from '../api';

export const PriorityInbox: React.FC = () => {
  const [priorityItems, setPriorityItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.log('frontend', 'info', 'component', 'PriorityInbox component mounted');
    
    const fetchPriority = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setPriorityItems([
          { id: 101, text: 'Critical server error', priority: 'high' }
        ]);
        logger.log('frontend', 'debug', 'api', 'Fetched priority items successfully');
      } catch (err) {
        logger.log('frontend', 'error', 'api', 'Failed to fetch priority items');
      } finally {
        setLoading(false);
      }
    };

    fetchPriority();

    // WebSocket integration mockup
    logger.log('frontend', 'info', 'hook', 'Initializing WebSocket connection');
    const ws = {
      close: () => {
         logger.log('frontend', 'info', 'hook', 'Closing WebSocket connection');
      }
    };

    return () => ws.close();
  }, []);

  if (loading) return <div className="loading">Loading priority inbox...</div>;

  return (
    <div className="card">
      <h2>Priority Inbox</h2>
      {priorityItems.length === 0 ? (
        <p>No critical items.</p>
      ) : (
        priorityItems.map(item => (
          <div key={item.id} className={`notification-item priority-${item.priority}`}>
            <strong>URGENT:</strong> {item.text}
          </div>
        ))
      )}
    </div>
  );
};
