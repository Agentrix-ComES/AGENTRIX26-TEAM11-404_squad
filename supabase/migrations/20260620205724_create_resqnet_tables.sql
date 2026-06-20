-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coordinator', 'responder', 'donor')),
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  category TEXT NOT NULL CHECK (category IN ('Rescue', 'Food & Rations', 'Medical Support', 'Shelter', 'Infrastructure', 'Other')),
  priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Dispatching', 'In Progress', 'Resolved')),
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_to TEXT,
  notes TEXT
);

-- Create donor_supplies table
CREATE TABLE IF NOT EXISTS donor_supplies (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  organization TEXT,
  contact TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  available_from TIMESTAMPTZ DEFAULT NOW(),
  matched BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_supplies ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "users_select_all" ON users FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "users_insert_authenticated" ON users FOR INSERT
  TO authenticated WITH CHECK (true);

-- Policies for incidents
CREATE POLICY "incidents_select_all" ON incidents FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "incidents_insert_all" ON incidents FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "incidents_update_all" ON incidents FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Policies for donor_supplies
CREATE POLICY "donor_supplies_select_all" ON donor_supplies FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "donor_supplies_insert_all" ON donor_supplies FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "donor_supplies_update_all" ON donor_supplies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidents_district ON incidents(district);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_at ON incidents(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_donor_supplies_district ON donor_supplies(district);
CREATE INDEX IF NOT EXISTS idx_donor_supplies_category ON donor_supplies(category);
CREATE INDEX IF NOT EXISTS idx_donor_supplies_matched ON donor_supplies(matched);