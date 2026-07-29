-- 012_indexes_constraints.sql
USE oniria_city;

-- MySQL requires indexes for foreign keys; most are declared inline above.
-- This migration is intentionally light and rerunnable for current development databases.
DROP PROCEDURE IF EXISTS oniria_create_index_if_missing;
DELIMITER //
CREATE PROCEDURE oniria_create_index_if_missing(
    IN table_name_value VARCHAR(128),
    IN index_name_value VARCHAR(128),
    IN create_statement_value TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = table_name_value
          AND index_name = index_name_value
    ) THEN
        SET @create_index_sql = create_statement_value;
        PREPARE stmt FROM @create_index_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//
DELIMITER ;

CALL oniria_create_index_if_missing('enquiries', 'idx_enquiries_status_created', 'CREATE INDEX idx_enquiries_status_created ON enquiries (status, created_at)');
CALL oniria_create_index_if_missing('leads', 'idx_leads_status_score', 'CREATE INDEX idx_leads_status_score ON leads (lead_status, lead_score)');
CALL oniria_create_index_if_missing('lead_follow_ups', 'idx_follow_ups_staff_due', 'CREATE INDEX idx_follow_ups_staff_due ON lead_follow_ups (assigned_to_staff_id, due_at)');

DROP PROCEDURE IF EXISTS oniria_create_index_if_missing;
