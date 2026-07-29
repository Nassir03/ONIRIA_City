-- 007_enquiries_requests.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_number VARCHAR(40) NULL UNIQUE,
  lead_id INT NOT NULL,
  enquiry_type VARCHAR(80) NOT NULL,
  property_id INT NULL,
  message TEXT NULL,
  preferred_contact_time VARCHAR(120) NULL,
  payload JSON NULL,
  score INT NOT NULL DEFAULT 0,
  follow_up_status VARCHAR(80) NULL,
  notification_status VARCHAR(80) NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enquiries_type (enquiry_type),
  INDEX idx_enquiries_created (created_at),
  CONSTRAINT fk_enquiries_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_enquiries_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS brochure_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  enquiry_id INT NULL,
  property_id INT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_brochure_requests_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_brochure_requests_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  enquiry_id INT NULL,
  preferred_date VARCHAR(60) NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_consultations_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_consultations_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  enquiry_id INT NULL,
  preferred_date VARCHAR(60) NULL,
  number_of_guests INT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_site_visits_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_site_visits_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL
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
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
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

CALL oniria_add_column_if_missing('enquiries', 'property_id', 'INT NULL');
CALL oniria_add_column_if_missing('enquiries', 'message', 'TEXT NULL');
CALL oniria_add_column_if_missing('enquiries', 'preferred_contact_time', 'VARCHAR(120) NULL');
CALL oniria_add_column_if_missing('enquiries', 'status', 'VARCHAR(60) NOT NULL DEFAULT ''new''');
CALL oniria_add_column_if_missing('enquiries', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

DROP PROCEDURE IF EXISTS oniria_add_column_if_missing;
