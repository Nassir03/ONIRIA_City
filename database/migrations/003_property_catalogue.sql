-- 003_property_catalogue.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS property_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  collection_id INT NULL,
  title VARCHAR(180) NOT NULL,
  property_type VARCHAR(80) NOT NULL,
  bedrooms INT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'published',
  price_label VARCHAR(160) NULL,
  hero_image VARCHAR(500) NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_properties_status (status),
  INDEX idx_properties_type (property_type),
  FULLTEXT KEY idx_properties_search (title, description),
  CONSTRAINT fk_properties_collection FOREIGN KEY (collection_id) REFERENCES property_collections(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS property_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  feature VARCHAR(180) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_property_features_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  media_type VARCHAR(30) NOT NULL DEFAULT 'image',
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_property_media_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS floor_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  bedrooms INT NULL,
  size_sqm DECIMAL(10,2) NULL,
  url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_floor_plans_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
