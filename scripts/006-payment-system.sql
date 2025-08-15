-- Payment system tables for Ghana-specific payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'mobile_money', 'card', 'bank_transfer', 'digital_wallet'
  provider VARCHAR(100) NOT NULL, -- 'mtn', 'vodafone', 'airteltigo', 'paystack', 'flutterwave'
  is_active BOOLEAN DEFAULT true,
  processing_fee_percentage DECIMAL(5,2) DEFAULT 0,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  maximum_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'GHS',
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
  payment_reference VARCHAR(255) UNIQUE,
  external_reference VARCHAR(255), -- Reference from payment provider
  payment_method_type VARCHAR(50) NOT NULL,
  payment_provider VARCHAR(100),
  phone_number VARCHAR(20), -- For mobile money payments
  card_last_four VARCHAR(4), -- For card payments
  transaction_fee DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2),
  payment_date TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'webhook', 'callback', 'status_update'
  provider VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Ghana-specific payment methods
INSERT INTO payment_methods (name, type, provider, is_active, processing_fee_percentage, minimum_amount, maximum_amount, display_order) VALUES
('MTN Mobile Money', 'mobile_money', 'mtn', true, 1.5, 1.00, 10000.00, 1),
('Vodafone Cash', 'mobile_money', 'vodafone', true, 1.5, 1.00, 10000.00, 2),
('AirtelTigo Money', 'mobile_money', 'airteltigo', true, 1.5, 1.00, 5000.00, 3),
('Visa/Mastercard', 'card', 'paystack', true, 2.9, 1.00, 50000.00, 4),
('Bank Transfer', 'bank_transfer', 'paystack', true, 0.5, 10.00, 100000.00, 5),
('Google Pay', 'digital_wallet', 'google', true, 2.5, 1.00, 20000.00, 6)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_payment_id ON payment_notifications(payment_id);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Payment methods are viewable by everyone" ON payment_methods FOR SELECT USING (true);

CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all payments" ON payments FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Functions for payment processing
CREATE OR REPLACE FUNCTION generate_payment_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'PAY_' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)) || '_' || EXTRACT(EPOCH FROM NOW())::bigint;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
  payment_ref TEXT,
  new_status TEXT,
  external_ref TEXT DEFAULT NULL,
  failure_reason_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  payment_record payments%ROWTYPE;
BEGIN
  -- Update payment status
  UPDATE payments 
  SET 
    status = new_status,
    external_reference = COALESCE(external_ref, external_reference),
    failure_reason = COALESCE(failure_reason_text, failure_reason),
    payment_date = CASE WHEN new_status = 'completed' THEN NOW() ELSE payment_date END,
    updated_at = NOW()
  WHERE payment_reference = payment_ref
  RETURNING * INTO payment_record;

  IF FOUND THEN
    -- Update booking status if payment is completed
    IF new_status = 'completed' THEN
      UPDATE bookings 
      SET 
        status = 'confirmed',
        updated_at = NOW()
      WHERE id = payment_record.booking_id;
    END IF;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
