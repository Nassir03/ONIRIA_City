-- 015_staff_account_recovery.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS staff_password_reset_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  staff_user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  revoked_at DATETIME NULL,
  requested_ip VARCHAR(80) NULL,
  requested_user_agent VARCHAR(300) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_staff_password_reset_tokens_token_hash (token_hash),
  INDEX idx_staff_password_reset_tokens_staff_user_id (staff_user_id),
  INDEX idx_staff_password_reset_tokens_expires_at (expires_at),
  CONSTRAINT fk_staff_password_reset_tokens_user
    FOREIGN KEY (staff_user_id) REFERENCES staff_users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS staff_account_recovery_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reference_number VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  known_email VARCHAR(254) NULL,
  phone VARCHAR(60) NOT NULL,
  staff_identifier VARCHAR(120) NULL,
  department VARCHAR(120) NULL,
  claimed_role VARCHAR(120) NULL,
  recovery_reason VARCHAR(80) NOT NULL,
  preferred_contact_method VARCHAR(40) NOT NULL,
  message TEXT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  assigned_admin_id INT NULL,
  resolution_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  INDEX idx_staff_account_recovery_reference_number (reference_number),
  INDEX idx_staff_account_recovery_status (status),
  INDEX idx_staff_account_recovery_created_at (created_at),
  INDEX idx_staff_account_recovery_assigned_admin_id (assigned_admin_id),
  CONSTRAINT fk_staff_account_recovery_assigned_admin
    FOREIGN KEY (assigned_admin_id) REFERENCES staff_users(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_staff_account_recovery_status
    CHECK (status IN ('pending', 'under_review', 'awaiting_verification', 'approved', 'resolved', 'rejected'))
);
