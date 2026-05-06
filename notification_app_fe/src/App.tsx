import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { PriorityInbox } from './components/PriorityInbox';
import { io } from 'socket.io-client';
import { evaluationClient, logger } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    logger.log('frontend', 'info', 'page', 'App initialized');
    
    // Authenticate with Evaluation Service transparently
    const setupEvalService = async () => {
      try {
        await evaluationClient.ensureAuthenticated();
        logger.log('frontend', 'info', 'auth', 'Registered and Authenticated with Evaluation Service successfully');
      } catch (err) {
        console.error("Evaluation service setup failed", err);
        logger.log('frontend', 'error', 'auth', 'Failed to authenticate with Evaluation Service');
      } finally {
        setIsInitializing(false);
      }
    };
    setupEvalService();

    // WebSocket Connection
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');
    socket.on('connect', () => {
      logger.log('frontend', 'info', 'api', 'Connected to real-time notification stream');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = async () => {
    try {
      logger.log('frontend', 'info', 'auth', 'Attempting local login');
      
      // Typical local auth logic here
      setIsAuthenticated(true);
      
      logger.log('frontend', 'info', 'state', 'User logged in successfully');
    } catch (error) {
      logger.log('frontend', 'error', 'auth', 'Login failed');
      alert('Login failed. Check console.');
    }
  };

  if (isInitializing) {
     return <div className="loading">Connecting to Evaluation Service...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
          <h2>Notification System</h2>
          <p>Please log in to continue</p>
          <button onClick={handleLogin}>Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Notification Center</h1>
        <button onClick={() => {
           setIsAuthenticated(false);
           logger.log('frontend', 'info', 'auth', 'User logged out');
        }}>Log Out</button>
      </div>
      <div className="dashboard">
        <Dashboard />
        <PriorityInbox />
      </div>
    </div>
  );
}

export default App;
