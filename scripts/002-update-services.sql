-- Adding new Ghana-specific services to the services table
INSERT INTO services (name, description, price, duration_hours, is_active) VALUES
('Naming Ceremony Photography', 'Traditional Ghanaian naming ceremony documentation with cultural sensitivity and beautiful family moments', 800, 4, true),
('Graduation Photography', 'Academic milestone celebrations including individual portraits and family group photos', 600, 3, true),
('Tourism & Travel Photography', 'Showcase Ghana''s natural beauty and cultural landmarks with professional travel photography', 1200, 6, true),
('Funeral Photography', 'Respectful documentation of memorial services and celebration of life ceremonies', 900, 5, true),
('Traditional Wedding Ceremony', 'Complete traditional Ghanaian wedding coverage including kente ceremonies and cultural rituals', 3500, 10, true),
('Engagement & Pre-Wedding', 'Romantic engagement sessions and pre-wedding photography in beautiful Ghanaian locations', 750, 3, true),
('Corporate Events', 'Professional corporate event photography for businesses and organizations', 1000, 4, true),
('Birthday & Celebrations', 'Special birthday celebrations and milestone parties with vibrant photography', 650, 4, true),
('Outdooring Ceremony', 'Traditional Ghanaian outdooring ceremonies celebrating new life with family and community', 700, 4, true),
('Cultural Festivals', 'Documentation of Ghana''s rich cultural festivals and traditional celebrations', 1500, 8, true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration_hours = EXCLUDED.duration_hours,
  is_active = EXCLUDED.is_active;
