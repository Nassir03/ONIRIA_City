-- Migration 004: Anonymous Sessions
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: anonymous_sessions, session_events

CREATE TABLE anonymous_sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  landing_page VARCHAR(500),
  user_agent VARCHAR(500),
  ip_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  session_id CHAR(36) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  page_path VARCHAR(500),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES anonymous_sessions(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_sessions_token ON anonymous_sessions(session_token);
CREATE INDEX idx_session_events_session ON session_events(session_id);