-- 010_conversations.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NULL,
  anonymous_session_id VARCHAR(120) NULL,
  external_conversation_id VARCHAR(160) NULL,
  channel VARCHAR(40) NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_conversations_session (anonymous_session_id),
  INDEX idx_conversations_external (external_conversation_id),
  CONSTRAINT fk_conversations_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  sender_type VARCHAR(40) NOT NULL,
  message_text TEXT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_feedback (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  rating VARCHAR(40) NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_feedback_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
