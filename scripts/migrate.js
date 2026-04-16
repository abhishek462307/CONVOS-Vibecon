const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  host: process.env.SUPABASE_DB_HOST || 'db.ynhiqtergpyamssxyrnj.supabase.co',
  port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || 'Abhishek@462307]',
  ssl: { rejectUnauthorized: false }
});

const migration = `
-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  category TEXT,
  image TEXT,
  stock INTEGER DEFAULT 0,
  bargain_enabled BOOLEAN DEFAULT false,
  bargain_min_price DECIMAL(10,2),
  tags TEXT[] DEFAULT '{}',
  weight TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  messages JSONB DEFAULT '[]'::jsonb,
  cart JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  budget_max DECIMAL(10,2),
  deadline TEXT,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intents (Intent Stream)
CREATE TABLE IF NOT EXISTS intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Consumer Profiles (Consumer Matrix)
CREATE TABLE IF NOT EXISTS consumer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  trust_score INTEGER DEFAULT 80,
  risk_level TEXT DEFAULT 'low',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  interactions INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}'::jsonb,
  traits TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  session_id TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  stripe_session_id TEXT,
  shipping_address JSONB,
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  session_id TEXT,
  author_name TEXT DEFAULT 'Anonymous',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store config
CREATE TABLE IF NOT EXISTS store_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  banner TEXT,
  categories TEXT[] DEFAULT '{}',
  ai_name TEXT DEFAULT 'Mark',
  ai_greeting TEXT,
  hero_image TEXT,
  logo_url TEXT,
  theme JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'live',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'email',
  status TEXT DEFAULT 'draft',
  audience_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  content JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_missions_session ON missions(session_id);
CREATE INDEX IF NOT EXISTS idx_intents_timestamp ON intents(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_intents_session ON intents(session_id);
CREATE INDEX IF NOT EXISTS idx_consumer_profiles_session ON consumer_profiles(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
`;

async function migrate() {
  console.log('Connecting to Supabase PostgreSQL...');
  try {
    const client = await pool.connect();
    console.log('Connected! Running migration...');
    await client.query(migration);
    console.log('Migration complete! Tables created.');
    
    // Check tables
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('Tables:', rows.map(r => r.table_name).join(', '));
    
    client.release();
    await pool.end();
    console.log('Done!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
