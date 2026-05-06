# Campus Notification Microservice

This project is a modular, scalable notification system integrated with a central Evaluation Service.

## Project Structure
- `logging_middleware/`: Shared SDK for centralized logging and authentication.
- `notification_app_be/`: Express.js backend with Clean Architecture (Routes, Controllers, Services).
- `notification_app_fe/`: React/Vite frontend with WebSocket integration.
- `notification_system_design.md`: Detailed architecture and algorithm documentation.
- `screenshots/`: Mandatory evaluation screenshots.

## Tech Stack
- **Backend**: Node.js, Express, Socket.io, PostgreSQL, Redis.
- **Frontend**: React, TypeScript, Vite, Socket.io-client.
- **Middleware**: Custom TypeScript SDK with Axios interceptors.

## Setup Instructions

### 1. Build Middleware
```bash
cd logging_middleware
npm install
npm run build
```

### 2. Backend Setup
```bash
cd notification_app_be
npm install
# Configure .env with EVALUATION_SERVICE_URL
npm run dev
```

### 3. Frontend Setup
```bash
cd notification_app_fe
npm install
npm run dev
```

## Core Algorithms

### Priority Inbox
Implemented in `notification_app_be/src/services/notificationService.ts`. Uses a multi-level sort: `Placement > Result > Event > Timestamp`.

### Vehicle Maintenance Scheduler
Implemented in `notification_app_be/src/services/schedulerService.ts`. Uses **Dynamic Programming (0/1 Knapsack)** to optimize task selection within a budget.

## Database Schema
The PostgreSQL schema is located in `notification_app_be/db/schema.sql`, including composite indexes for priority inbox optimization.

## Screenshots
Please refer to the `screenshots/` directory for visual verification of the API flows and dashboard.
