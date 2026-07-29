-- Migration 006: Campaign Attribution
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: campaigns, campaign_visits, campaign_conversions

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255) NOT NULL,
  platform VARCHAR(100),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaigns_utm ON campaigns(utm_campaign);
CREATE INDEX idx_campaigns_active ON campaigns(is_active);

CREATE TABLE campaign_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  session_id UUID NOT NULL REFERENCES anonymous_sessions(id) ON DELETE CASCADE,
  landing_page VARCHAR(500),
  referrer VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_visits_campaign ON campaign_visits(campaign_id);
CREATE INDEX idx_campaign_visits_session ON campaign_visits(session_id);

CREATE TYPE conversion_type AS ENUM ('enquiry', 'brochure_request', 'consultation', 'site_visit', 'ai_chat');

CREATE TABLE campaign_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  session_id UUID NOT NULL REFERENCES anonymous_sessions(id),
  lead_id UUID REFERENCES leads(id),
  conversion_type conversion_type NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_conversions_campaign ON campaign_conversions(campaign_id);
CREATE INDEX idx_campaign_conversions_lead ON campaign_conversions(lead_id);