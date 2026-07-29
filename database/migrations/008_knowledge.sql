-- Migration 008: Knowledge Base
-- Created by Kelvin - Database & Knowledge Integration
-- Tables: knowledge_documents, knowledge_chunks, knowledge_sync_runs
-- Vector search uses FAISS, managed by the Python backend (Abdull-Nassir).
-- faiss_vector_id in knowledge_chunks links each chunk to its FAISS vector.

CREATE TYPE document_status AS ENUM ('draft', 'review', 'approved', 'archived');

CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  project VARCHAR(100),
  file_path VARCHAR(500) NOT NULL,
  status document_status DEFAULT 'draft',
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  public_channel_allowed BOOLEAN DEFAULT FALSE,
  tags JSONB,
  last_updated_obsidian TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_knowledge_documents_status ON knowledge_documents(status);
CREATE INDEX idx_knowledge_documents_active ON knowledge_documents(is_active);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_order INT DEFAULT 0,
  faiss_vector_id VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_knowledge_chunks_document ON knowledge_chunks(document_id);
CREATE INDEX idx_knowledge_chunks_active ON knowledge_chunks(is_active);
CREATE INDEX idx_knowledge_chunks_faiss ON knowledge_chunks(faiss_vector_id);

CREATE TYPE sync_status AS ENUM ('running', 'success', 'failed');

CREATE TABLE knowledge_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status sync_status DEFAULT 'running',
  documents_processed INT DEFAULT 0,
  documents_updated INT DEFAULT 0,
  errors TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);