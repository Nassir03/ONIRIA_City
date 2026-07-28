-- ONIRIA City Database Schema
-- Created by Kelvin - Database & Knowledge Integration

CREATE DATABASE IF NOT EXISTS oniria_city;
USE oniria_city;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  supabase_auth_id VARCHAR(255) UNIQUE,
  role ENUM('customer', 'sales', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  type ENUM('villa', 'residence', 'commercial') NOT NULL,
  subtype VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  bedrooms INT,
  bathrooms INT,
  size_sqm DECIMAL(10,2),
  price DECIMAL(12,2),
  status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
