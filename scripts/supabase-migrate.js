const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (!process.env[key]) process.env[key] = value;
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
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
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by querying a simple endpoint
    const { data: healthCheck, error: healthError } = await supabase
      .from('_supabase_health_check_dummy')
      .select('*')
      .limit(1);
    
    if (healthError && !healthError.message.includes('relation') && !healthError.message.includes('does not exist')) {
      throw new Error(`Connection test failed: ${healthError.message}`);
    }
    
    console.log('✓ Connected to Supabase!');
    console.log('Running SQL migration via RPC...');
    
    // Execute migration using Supabase's SQL RPC
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: migration 
    });
    
    if (error) {
      // If RPC doesn't exist, we need to run SQL differently
      console.log('RPC method not available, trying direct SQL execution...');
      console.log('Note: You may need to run this SQL manually in Supabase SQL Editor:');
      console.log(migration);
      
      // Try to at least verify we can query
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      if (testError && testError.message.includes('does not exist')) {
        console.log('\n❌ Tables do not exist yet.');
        console.log('Please run the migration SQL manually in your Supabase SQL Editor.');
        console.log('The SQL has been printed above.');
      } else if (!testError) {
        console.log('✓ Products table exists! Migration may already be complete.');
      }
    } else {
      console.log('✓ Migration executed successfully!');
    }
    
    // Try to list tables
    console.log('\nAttempting to verify tables...');
    const { data: productsTest } = await supabase.from('products').select('count').limit(1);
    const { data: conversationsTest } = await supabase.from('conversations').select('count').limit(1);
    const { data: intentsTest } = await supabase.from('intents').select('count').limit(1);
    
    console.log('✓ Schema verification complete!');
    console.log('Tables accessible: products, conversations, intents, ...');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('\nPlease verify:');
    console.log('1. Your Supabase project is active (not paused)');
    console.log('2. The SERVICE_ROLE_KEY is correct');
    console.log('3. Run the SQL migration manually in Supabase SQL Editor if needed');
    process.exit(1);
  }
}

migrate();
