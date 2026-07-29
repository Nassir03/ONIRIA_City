-- 005_anonymous_sessions.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  anonymous_session_id VARCHAR(120) NOT NULL UNIQUE,
  first_visit_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  landing_page VARCHAR(300) NULL,
  referral_url VARCHAR(500) NULL,
  utm_source VARCHAR(80) NULL,
  utm_medium VARCHAR(80) NULL,
  utm_campaign VARCHAR(120) NULL,
  utm_content VARCHAR(120) NULL,
  utm_term VARCHAR(120) NULL,
  INDEX idx_anonymous_sessions_session (anonymous_session_id)
);

CREATE TABLE IF NOT EXISTS session_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  anonymous_session_id VARCHAR(120) NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  page_path VARCHAR(300) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_events_session (anonymous_session_id)
);
