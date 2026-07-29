-- 016_newsletter_subscriptions.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  source_page VARCHAR(255) NULL,
  anonymous_session_id VARCHAR(120) NULL,
  utm_source VARCHAR(120) NULL,
  utm_medium VARCHAR(120) NULL,
  utm_campaign VARCHAR(160) NULL,
  utm_content VARCHAR(160) NULL,
  consent TINYINT(1) NOT NULL DEFAULT 0,
  subscribed_at DATETIME NULL,
  unsubscribed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_newsletter_subscriptions_email (email),
  INDEX idx_newsletter_subscriptions_status (status),
  INDEX idx_newsletter_subscriptions_subscribed_at (subscribed_at),
  INDEX idx_newsletter_subscriptions_utm_campaign (utm_campaign),
  CONSTRAINT chk_newsletter_subscriptions_status
    CHECK (status IN ('active', 'unsubscribed', 'suppressed'))
);
