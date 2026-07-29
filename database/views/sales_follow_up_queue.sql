USE oniria_city;
CREATE OR REPLACE VIEW sales_follow_up_queue AS
SELECT
  l.id AS lead_id,
  COALESCE(l.reference_number, e.reference_number) AS reference,
  COALESCE(c.full_name, l.name) AS customer,
  su.full_name AS assigned_salesperson,
  l.next_follow_up_at AS follow_up_due_at,
  COALESCE(l.lead_status, l.follow_up_status) AS current_status,
  MAX(la.created_at) AS last_activity_at,
  CASE WHEN l.next_follow_up_at IS NOT NULL AND l.next_follow_up_at < CURRENT_TIMESTAMP THEN 1 ELSE 0 END AS is_overdue
FROM leads l
LEFT JOIN customers c ON c.id = l.customer_id
LEFT JOIN staff_users su ON su.id = l.assigned_salesperson_id
LEFT JOIN lead_activities la ON la.lead_id = l.id
LEFT JOIN enquiries e ON e.lead_id = l.id
GROUP BY l.id, reference, customer, assigned_salesperson, follow_up_due_at, current_status;
