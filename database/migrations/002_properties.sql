-- Migration 002: Property Catalogue
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: property_collections, properties, property_features, property_media, floor_plans

CREATE TABLE property_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE property_type AS ENUM ('villa', 'residence', 'commercial');
CREATE TYPE property_status AS ENUM ('available', 'reserved', 'sold');

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES property_collections(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type property_type NOT NULL,
  subtype VARCHAR(100),
  bedrooms INT,
  bathrooms INT,
  size_sqm DECIMAL(10,2),
  price DECIMAL(12,2),
  status property_status DEFAULT 'available',
  is_published BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature_name VARCHAR(255) NOT NULL,
  feature_value VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE media_type AS ENUM ('image', 'video');

CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_type media_type NOT NULL,
  url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  size_sqm DECIMAL(10,2),
  bedrooms INT,
  bathrooms INT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_collection ON properties(collection_id);
CREATE INDEX idx_properties_published ON properties(is_published, is_approved);
CREATE INDEX idx_property_media_property ON property_media(property_id);
CREATE INDEX idx_floor_plans_property ON floor_plans(property_id);