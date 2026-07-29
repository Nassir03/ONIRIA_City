-- 008_lead_operations.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS lead_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  reference_number VARCHAR(40) NULL,
  activity_type VARCHAR(80) NOT NULL,
  summary TEXT NOT NULL,
  campaign JSON NULL,
  created_by_staff_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lead_activities_lead (lead_id),
  CONSTRAINT fk_lead_activities_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_lead_activities_staff FOREIGN KEY (created_by_staff_id) REFERENCES staff_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  note TEXT NOT NULL,
  created_by_staff_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lead_notes_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_lead_notes_staff FOREIGN KEY (created_by_staff_id) REFERENCES staff_users(id)
);

CREATE TABLE IF NOT EXISTS lead_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  assigned_to_staff_id INT NOT NULL,
  assigned_by_staff_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lead_assignments_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_lead_assignments_to_staff FOREIGN KEY (assigned_to_staff_id) REFERENCES staff_users(id),
  CONSTRAINT fk_lead_assignments_by_staff FOREIGN KEY (assigned_by_staff_id) REFERENCES staff_users(id)
);

CREATE TABLE IF NOT EXISTS lead_follow_ups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  assigned_to_staff_id INT NULL,
  due_at DATETIME NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'pending',
  outcome TEXT NULL,
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lead_follow_ups_due (due_at),
  INDEX idx_lead_follow_ups_status (status),
  CONSTRAINT fk_lead_follow_ups_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_lead_follow_ups_staff FOREIGN KEY (assigned_to_staff_id) REFERENCES staff_users(id) ON DELETE SET NULL
);
