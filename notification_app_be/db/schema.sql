-- Notification Microservice Database Schema

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    placement INT NOT NULL, -- Priority Level 1
    result INT NOT NULL,    -- Priority Level 2
    event INT NOT NULL,     -- Priority Level 3
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Priority Inbox Optimization
CREATE INDEX idx_notifications_priority_search ON notifications (placement, result, event, created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);

-- Vehicle Maintenance Table
CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name VARCHAR(255) NOT NULL,
    estimated_cost DECIMAL(10, 2) NOT NULL,
    priority_score INT NOT NULL, -- Benefit value for DP scheduler
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
