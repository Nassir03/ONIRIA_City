-- 002_staff_security.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS staff_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_key VARCHAR(60) NOT NULL UNIQUE,
  role_name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_staff_users_active (is_active)
);

CREATE TABLE IF NOT EXISTS staff_user_roles (
  staff_user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (staff_user_id, role_id),
  CONSTRAINT fk_staff_user_roles_user FOREIGN KEY (staff_user_id) REFERENCES staff_users(id),
  CONSTRAINT fk_staff_user_roles_role FOREIGN KEY (role_id) REFERENCES staff_roles(id)
);

CREATE TABLE IF NOT EXISTS staff_sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  staff_user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_staff_sessions_user (staff_user_id),
  INDEX idx_staff_sessions_expires (expires_at),
  CONSTRAINT fk_staff_sessions_user FOREIGN KEY (staff_user_id) REFERENCES staff_users(id)
);

CREATE TABLE IF NOT EXISTS staff_login_attempts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  ip_address VARCHAR(80) NULL,
  succeeded TINYINT(1) NOT NULL DEFAULT 0,
  failure_reason VARCHAR(160) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_staff_login_attempts_email_created (email, created_at)
);
