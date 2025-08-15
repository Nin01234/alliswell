-- Adding comprehensive social media data for Ghana-based photography business
INSERT INTO social_media_links (platform, url, is_active, display_order) VALUES
('instagram', 'https://instagram.com/alliswellshotit', true, 1),
('facebook', 'https://facebook.com/alliswellshotit', true, 2),
('whatsapp', 'https://wa.me/233308131617', true, 3),
('telegram', 'https://t.me/alliswellshotit', true, 4),
('twitter', 'https://twitter.com/alliswellshotit', true, 5),
('youtube', 'https://youtube.com/@alliswellshotit', true, 6)
ON CONFLICT (platform) DO UPDATE SET
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;
