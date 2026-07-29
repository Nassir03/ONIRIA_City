-- 009_campaigns.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  source_platform VARCHAR(80) NOT NULL,
  campaign_name VARCHAR(120) NULL,
  utm_source VARCHAR(80) NULL,
  utm_medium VARCHAR(80) NULL,
  utm_campaign VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_campaign_identity (source_platform, utm_source, utm_medium, utm_campaign)
);

CREATE TABLE IF NOT EXISTS campaign_visits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  campaign_id BIGINT NULL,
  anonymous_session_id VARCHAR(120) NOT NULL,
  landing_page VARCHAR(300) NULL,
  referral_url VARCHAR(500) NULL,
  first_visit_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaign_visits_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS campaign_conversions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  campaign_visit_id BIGINT NULL,
  lead_id INT NOT NULL,
  conversion_type VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaign_conversions_visit FOREIGN KEY (campaign_visit_id) REFERENCES campaign_visits(id) ON DELETE SET NULL,
  CONSTRAINT fk_campaign_conversions_lead FOREIGN KEY (lead_id) REFERENCES leads(id)
);
