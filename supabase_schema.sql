-- Profiles: Federated User Accounts
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
  subscription TEXT DEFAULT 'free',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues: Assets owned by Owners
CREATE TABLE IF NOT EXISTS turfs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  tagline TEXT,
  location TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  sport_types JSONB,
  amenities JSONB,
  venue_rules JSONB,
  price_per_hour NUMERIC,
  weekend_price NUMERIC,
  courts INTEGER DEFAULT 1,
  open_time TIME,
  close_time TIME,
  status TEXT DEFAULT 'pending',
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings: User transactions
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  turf_id UUID REFERENCES turfs(id),
  date DATE,
  start_time TIME,
  end_time TIME,
  amount NUMERIC,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'paid',
  transaction_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Pricing Configuration
CREATE TABLE IF NOT EXISTS global_pricing (
  id TEXT PRIMARY KEY,
  active BOOLEAN DEFAULT false,
  multiplier NUMERIC DEFAULT 1.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Pricing Rules
INSERT INTO global_pricing (id, active, multiplier) VALUES 
('weekendSurge', true, 1.20),
('peakHourSurge', true, 1.15),
('weatherDiscount', false, 0.85),
('lowOccupancyDrop', true, 0.90)
ON CONFLICT (id) DO NOTHING;
