USE oniria_city;

SELECT DATABASE() AS current_database;
SHOW TABLES;
SELECT COUNT(*) AS staff_roles FROM staff_roles;
SELECT COUNT(*) AS properties FROM properties;
SELECT COUNT(*) AS leads FROM leads;
SHOW FULL TABLES WHERE Table_type = 'VIEW';
