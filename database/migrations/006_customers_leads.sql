-- 006_customers_leads.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS enquiry_reference_sequence (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NULL,
  phone VARCHAR(40) NULL,
  country VARCHAR(100) NULL,
  preferred_language VARCHAR(60) NULL,
  preferred_contact_method VARCHAR(60) NULL,
  marketing_consent TINYINT(1) NOT NULL DEFAULT 0,
  privacy_consent TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_email (email),
  INDEX idx_customers_phone (phone),
  INDEX idx_customers_created (created_at)
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_number VARCHAR(40) NULL UNIQUE,
  customer_id INT NULL,
  anonymous_session_id VARCHAR(120) NULL,
  property_id INT NULL,
  name VARCHAR(160) NULL,
  email VARCHAR(254) NULL,
  phone VARCHAR(40) NULL,
  property_interest VARCHAR(180) NULL,
  property_interests JSON NULL,
  collection_interests JSON NULL,
  bedroom_preference VARCHAR(80) NULL,
  budget_range VARCHAR(100) NULL,
  buying_purpose VARCHAR(120) NULL,
  purchase_timeframe VARCHAR(80) NULL,
  score INT NOT NULL DEFAULT 0,
  lead_score INT NOT NULL DEFAULT 0,
  follow_up_status VARCHAR(80) NOT NULL DEFAULT 'new',
  lead_status VARCHAR(80) NOT NULL DEFAULT 'New',
  source_platform VARCHAR(80) NULL,
  campaign_name VARCHAR(120) NULL,
  utm_source VARCHAR(80) NULL,
  utm_medium VARCHAR(80) NULL,
  utm_campaign VARCHAR(120) NULL,
  utm_content VARCHAR(120) NULL,
  utm_term VARCHAR(120) NULL,
  landing_page VARCHAR(300) NULL,
  referral_url VARCHAR(500) NULL,
  assigned_salesperson_id INT NULL,
  next_follow_up_at DATETIME NULL,
  last_contacted_at DATETIME NULL,
  last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leads_status (lead_status),
  INDEX idx_leads_follow_up_status (follow_up_status),
  INDEX idx_leads_assigned (assigned_salesperson_id),
  INDEX idx_leads_next_follow_up (next_follow_up_at),
  INDEX idx_leads_source (source_platform),
  INDEX idx_leads_utm_campaign (utm_campaign),
  INDEX idx_leads_anonymous_session (anonymous_session_id),
  INDEX idx_leads_created (created_at),
  INDEX idx_leads_email (email),
  INDEX idx_leads_phone (phone),
  CONSTRAINT fk_leads_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_assigned_staff FOREIGN KEY (assigned_salesperson_id) REFERENCES staff_users(id) ON DELETE SET NULL
);

DROP PROCEDURE IF EXISTS oniria_add_column_if_missing;
DELIMITER //
CREATE PROCEDURE oniria_add_column_if_missing(
  IN table_name_value VARCHAR(64),
  IN column_name_value VARCHAR(64),
  IN column_definition TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND COLUMN_NAME = column_name_value
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE `', table_name_value, '` ADD COLUMN `', column_name_value, '` ', column_definition);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//
DELIMITER ;

CALL oniria_add_column_if_missing('leads', 'reference_number', 'VARCHAR(40) NULL UNIQUE');
CALL oniria_add_column_if_missing('leads', 'customer_id', 'INT NULL');
CALL oniria_add_column_if_missing('leads', 'anonymous_session_id', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'property_id', 'INT NULL');
CALL oniria_add_column_if_missing('leads', 'property_interest', 'VARCHAR(180) NULL');
CALL oniria_add_column_if_missing('leads', 'bedroom_preference', 'VARCHAR(80) NULL');
CALL oniria_add_column_if_missing('leads', 'budget_range', 'VARCHAR(100) NULL');
CALL oniria_add_column_if_missing('leads', 'buying_purpose', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'purchase_timeframe', 'VARCHAR(80) NULL');
CALL oniria_add_column_if_missing('leads', 'lead_score', 'INT NOT NULL DEFAULT 0');
CALL oniria_add_column_if_missing('leads', 'lead_status', 'VARCHAR(80) NOT NULL DEFAULT ''New''');
CALL oniria_add_column_if_missing('leads', 'source_platform', 'VARCHAR(80) NULL');
CALL oniria_add_column_if_missing('leads', 'campaign_name', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'utm_source', 'VARCHAR(80) NULL');
CALL oniria_add_column_if_missing('leads', 'utm_medium', 'VARCHAR(80) NULL');
CALL oniria_add_column_if_missing('leads', 'utm_campaign', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'utm_content', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'utm_term', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('leads', 'landing_page', 'VARCHAR(300) NULL');
CALL oniria_add_column_if_missing('leads', 'referral_url', 'VARCHAR(500) NULL');
CALL oniria_add_column_if_missing('leads', 'assigned_salesperson_id', 'INT NULL');
CALL oniria_add_column_if_missing('leads', 'next_follow_up_at', 'DATETIME NULL');
CALL oniria_add_column_if_missing('leads', 'last_contacted_at', 'DATETIME NULL');
CALL oniria_add_column_if_missing('leads', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

DROP PROCEDURE IF EXISTS oniria_add_column_if_missing;
