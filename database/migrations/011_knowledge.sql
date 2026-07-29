-- 011_knowledge.sql
USE oniria_city;

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  document_id VARCHAR(160) NOT NULL,
  version VARCHAR(60) NOT NULL DEFAULT 'v1',
  title VARCHAR(180) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'draft',
  channel VARCHAR(40) NOT NULL DEFAULT 'public',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_knowledge_document_version (document_id, version)
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  knowledge_document_id BIGINT NULL,
  document_id VARCHAR(160) NOT NULL,
  answer TEXT NOT NULL,
  actions JSON NULL,
  content TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'approved',
  channel VARCHAR(40) NOT NULL DEFAULT 'public',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_knowledge_chunk_document (document_id),
  FULLTEXT KEY idx_knowledge_content (content),
  CONSTRAINT fk_knowledge_chunks_document FOREIGN KEY (knowledge_document_id) REFERENCES knowledge_documents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS knowledge_sync_runs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(60) NOT NULL,
  summary TEXT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL
);
