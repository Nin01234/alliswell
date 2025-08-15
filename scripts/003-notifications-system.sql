-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'upload', 'admin', 'system', 'payment')),
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin can view all notifications
CREATE POLICY "Admin can view all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can create notifications for any user
CREATE POLICY "Admin can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- System can create notifications (for triggers)
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, data)
  VALUES (p_user_id, p_title, p_message, p_type, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications 
  SET is_read = TRUE, updated_at = NOW()
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET is_read = TRUE, updated_at = NOW()
  WHERE user_id = auth.uid() AND is_read = FALSE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to create booking notifications
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER AS $$
DECLARE
  service_name TEXT;
  admin_user_id UUID;
BEGIN
  -- Get service name
  SELECT name INTO service_name FROM services WHERE id = NEW.service_id;
  
  -- Create notification for user
  PERFORM create_notification(
    NEW.user_id,
    'Booking Submitted',
    'Your booking for ' || service_name || ' has been submitted and is pending approval.',
    'booking',
    jsonb_build_object('booking_id', NEW.id, 'service_name', service_name)
  );
  
  -- Create notification for admin
  SELECT user_id INTO admin_user_id FROM user_profiles WHERE role = 'admin' LIMIT 1;
  IF admin_user_id IS NOT NULL THEN
    PERFORM create_notification(
      admin_user_id,
      'New Booking Request',
      'A new booking request for ' || service_name || ' has been submitted.',
      'booking',
      jsonb_build_object('booking_id', NEW.id, 'service_name', service_name, 'user_id', NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create booking status notifications
CREATE OR REPLACE FUNCTION notify_booking_status_changed()
RETURNS TRIGGER AS $$
DECLARE
  service_name TEXT;
BEGIN
  -- Only notify if status actually changed
  IF OLD.status != NEW.status THEN
    -- Get service name
    SELECT name INTO service_name FROM services WHERE id = NEW.service_id;
    
    -- Create notification for user
    PERFORM create_notification(
      NEW.user_id,
      'Booking ' || INITCAP(NEW.status),
      'Your booking for ' || service_name || ' has been ' || NEW.status || '.',
      'booking',
      jsonb_build_object('booking_id', NEW.id, 'service_name', service_name, 'status', NEW.status)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create message notifications
CREATE OR REPLACE FUNCTION notify_message_created()
RETURNS TRIGGER AS $$
DECLARE
  recipient_user_id UUID;
  sender_name TEXT;
BEGIN
  -- Determine recipient (if sender is admin, notify user; if sender is user, notify admin)
  SELECT up.role, up.full_name INTO sender_name FROM user_profiles up WHERE up.user_id = NEW.sender_id;
  
  IF sender_name = 'admin' THEN
    -- Admin sent message, notify the user
    recipient_user_id := (SELECT user_id FROM bookings WHERE id = NEW.booking_id);
    PERFORM create_notification(
      recipient_user_id,
      'New Message from Photographer',
      'You have received a new message about your booking.',
      'message',
      jsonb_build_object('booking_id', NEW.booking_id, 'message_id', NEW.id)
    );
  ELSE
    -- User sent message, notify admin
    SELECT user_id INTO recipient_user_id FROM user_profiles WHERE role = 'admin' LIMIT 1;
    IF recipient_user_id IS NOT NULL THEN
      PERFORM create_notification(
        recipient_user_id,
        'New Message from Client',
        'You have received a new message from ' || sender_name || '.',
        'message',
        jsonb_build_object('booking_id', NEW.booking_id, 'message_id', NEW.id, 'sender_name', sender_name)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_booking_created ON bookings;
CREATE TRIGGER trigger_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_booking_created();

DROP TRIGGER IF EXISTS trigger_booking_status_changed ON bookings;
CREATE TRIGGER trigger_booking_status_changed
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_booking_status_changed();

DROP TRIGGER IF EXISTS trigger_message_created ON messages;
CREATE TRIGGER trigger_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_message_created();
