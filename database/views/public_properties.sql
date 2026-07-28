-- View: public_properties
-- Only exposes published AND approved properties to public APIs

CREATE VIEW public_properties AS
SELECT
  p.id,
  p.slug,
  p.title,
  p.type,
  p.subtype,
  p.bedrooms,
  p.bathrooms,
  p.size_sqm,
  p.price,
  p.status,
  p.description,
  p.collection_id,
  pc.name AS collection_name
FROM properties p
LEFT JOIN property_collections pc ON p.collection_id = pc.id
WHERE p.is_published = TRUE AND p.is_approved = TRUE;