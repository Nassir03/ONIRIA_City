-- Migration 007: AI and WhatsApp Conversations
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: conversations, messages, ai_feedback

CREATE TYPE conversation_channel AS ENUM ('web_chat', 'whatsapp');

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES anonymous_sessions(id),
  lead_id UUID REFERENCES leads(id),
  channel conversation_channel NOT NULL,
  whatsapp_number VARCHAR(50),
  is_escalated BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_lead ON conversations(lead_id);
CREATE INDEX idx_conversations_escalated ON conversations(is_escalated);

CREATE TYPE message_role AS ENUM ('visitor', 'ai', 'human_agent');

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  confidence DECIMAL(4,3),
  source_document_ids JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);

CREATE TYPE feedback_rating AS ENUM ('helpful', 'not_helpful');

CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  rating feedback_rating NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_feedback_message ON ai_feedback(message_id);