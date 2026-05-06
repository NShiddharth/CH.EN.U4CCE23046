# Notification System Design

## Architecture Overview
The system is designed as a scalable microservices architecture with a React frontend and a Node.js/Express backend.

### Components
1. **Frontend (`notification_app_fe`)**
   - React application built with Vite.
   - Manages state, handles WebSocket connections for real-time updates.
   - Uses the shared `logging_middleware` for central observability.

2. **Backend (`notification_app_be`)**
   - Express server handling REST APIs.
   - Designed for async processing (e.g., placing notifications in a queue).
   - Uses `logging_middleware` for observability.

3. **Logging Middleware (`logging_middleware`)**
   - Shared SDK for calling the Evaluation Service.
   - Validates log payload before sending.
   - Includes an API client with exponential backoff retry mechanisms.

- The `EvaluationApiClient` communicates via HTTP REST to the external Evaluation Service (`/register`, `/auth`, `/logs`) attaching JWT bearer tokens.

## Optimization & Algorithms

### 1. Priority Inbox Sorting
The inbox uses a weighted multi-level sorting algorithm to ensure critical notifications are seen first:
- **Level 1 (Placement)**: Primary grouping.
- **Level 2 (Result)**: Secondary tie-breaker.
- **Level 3 (Event)**: Tertiary tie-breaker.
- **Level 4 (Timestamp)**: Ensuring fresh data within same priority buckets.

### 2. Vehicle Maintenance Scheduler
The scheduler implements a **Dynamic Programming (0/1 Knapsack)** solution to optimize task selection within a fixed budget. This ensures the maximum possible "Priority Value" (system benefit) is achieved, which is superior to a greedy approach that might leave budget unspent or pick suboptimal tasks.

## Scaling & Performance
- **Indexing**: The PostgreSQL schema includes composite indexes on `(placement, result, event, created_at)` to allow the priority inbox query to run in O(log n) time.
- **Caching**: Redis is used to store frequently accessed notification counts.
- **WebSocket**: Real-time push updates are handled via `socket.io` for zero-latency user alerts.

## Scaling & Performance
- The backend could be extended to use message brokers (like RabbitMQ) for processing notifications at high scale without blocking the HTTP request-response cycle.
- The logging SDK operates asynchronously (fire-and-forget from the caller's perspective) ensuring that logging does not degrade application performance.

## Data Flow
1. User logs in (Frontend) -> Backend simulated auth -> Evaluation Client `auth` to get token.
2. Token is saved in local storage (FE) / variable (BE).
3. Both FE and BE components use the `Logger` to dispatch events (e.g., `info`, `error`) to the Evaluation Service using the bearer token.
