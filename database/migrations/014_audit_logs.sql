-- 014_audit_logs.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_staff_id INT NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NOT NULL,
  before_json JSON NULL,
  after_json JSON NULL,
  ip_address VARCHAR(80) NULL,
  user_agent VARCHAR(300) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_actor (actor_staff_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_staff_id) REFERENCES staff_users(id) ON DELETE SET NULL
);
