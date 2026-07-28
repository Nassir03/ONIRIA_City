-- Migration 003: Masterplan and Amenities
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: masterplan_zones, amenities, property_amenities

CREATE TABLE masterplan_zones (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  zone_type VARCHAR(100),
  description TEXT,
  map_coordinates JSON,
  image_url VARCHAR(500),
  related_collection_id CHAR(36),
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (related_collection_id) REFERENCES property_collections(id)
);

CREATE TABLE amenities (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  icon VARCHAR(255),
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_amenities (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  property_id CHAR(36) NOT NULL,
  amenity_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_property_amenity (property_id, amenity_id)
);

-- Indexes
CREATE INDEX idx_masterplan_zones_slug ON masterplan_zones(slug);