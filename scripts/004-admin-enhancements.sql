-- Create admin_uploads table for photos uploaded by admin
CREATE TABLE IF NOT EXISTS admin_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'general' CHECK (category IN ('portfolio', 'gallery', 'general', 'client_delivery')),
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_uploads_admin_id ON admin_uploads(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_uploads_category ON admin_uploads(category);
CREATE INDEX IF NOT EXISTS idx_admin_uploads_client_id ON admin_uploads(client_id);
CREATE INDEX IF NOT EXISTS idx_admin_uploads_booking_id ON admin_uploads(booking_id);
CREATE INDEX IF NOT EXISTS idx_admin_uploads_is_public ON admin_uploads(is_public);

-- Enable RLS
ALTER TABLE admin_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage all uploads" ON admin_uploads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view public uploads" ON admin_uploads
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can view their assigned uploads" ON admin_uploads
  FOR SELECT USING (client_id = auth.uid());

-- Create social_media_links table
CREATE TABLE IF NOT EXISTS social_media_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('instagram', 'facebook', 'twitter', 'youtube', 'tiktok', 'linkedin', 'whatsapp', 'telegram')),
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default social media links
INSERT INTO social_media_links (platform, url, is_active, display_order) VALUES
('instagram', 'https://instagram.com/alliswellshotit', true, 1),
('facebook', 'https://facebook.com/alliswellshotit', true, 2),
('twitter', 'https://twitter.com/alliswellshotit', true, 3),
('whatsapp', 'https://wa.me/233308131617', true, 4),
('youtube', 'https://youtube.com/@alliswellshotit', true, 5),
('tiktok', 'https://tiktok.com/@alliswellshotit', true, 6)
ON CONFLICT (platform) DO UPDATE SET
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- Enable RLS
ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active social media links" ON social_media_links
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admin can manage social media links" ON social_media_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Function to get user details for admin
CREATE OR REPLACE FUNCTION get_user_details_for_admin(user_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  total_bookings BIGINT,
  total_spent NUMERIC,
  last_booking_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    au.email,
    up.full_name,
    up.phone,
    up.role,
    up.created_at,
    COALESCE(b.booking_count, 0) as total_bookings,
    COALESCE(b.total_amount, 0) as total_spent,
    b.last_booking_date
  FROM user_profiles up
  LEFT JOIN auth.users au ON up.user_id = au.id
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as booking_count,
      SUM(total_amount) as total_amount,
      MAX(created_at) as last_booking_date
    FROM bookings 
    WHERE user_id = user_uuid
    GROUP BY user_id
  ) b ON up.user_id = b.user_id
  WHERE up.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
