USE oniria_city;
CREATE OR REPLACE VIEW campaign_performance AS
SELECT
  COALESCE(l.utm_source, l.source_platform, 'direct') AS source,
  COALESCE(l.utm_campaign, l.campaign_name, 'none') AS campaign,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT e.id) AS enquiries,
  AVG(GREATEST(COALESCE(l.lead_score, 0), COALESCE(l.score, 0))) AS average_score
FROM leads l
LEFT JOIN enquiries e ON e.lead_id = l.id
GROUP BY source, campaign;
