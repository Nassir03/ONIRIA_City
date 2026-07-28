-- Migration 002: Property Catalogue
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: property_collections, properties, property_features, property_media, floor_plans

CREATE TABLE property_collections (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE properties (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  collection_id CHAR(36),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM('villa', 'residence', 'commercial') NOT NULL,
  subtype VARCHAR(100),
  bedrooms INT,
  bathrooms INT,
  size_sqm DECIMAL(10,2),
  price DECIMAL(12,2),
  status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  is_published BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES property_collections(id)
);

CREATE TABLE property_features (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  property_id CHAR(36) NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  feature_value VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE property_media (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  property_id CHAR(36) NOT NULL,
  media_type ENUM('image', 'video') NOT NULL,
  url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE floor_plans (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  property_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  size_sqm DECIMAL(10,2),
  bedrooms INT,
  bathrooms INT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_collection ON properties(collection_id);
CREATE INDEX idx_properties_published ON properties(is_published, is_approved);
CREATE INDEX idx_property_media_property ON property_media(property_id);
CREATE INDEX idx_floor_plans_property ON floor_plans(property_id);