const { Client } = require('pg');

// Try connection pooler on port 6543 (transaction mode)
const connectionString = 'postgresql://postgres:zebbut-gebpyd-8sywbA@db.ynhiqtergpyamssxyrnj.supabase.co:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  console.log('Testing Supabase connection pooler (port 6543)...');
  try {
    await client.connect();
    console.log('✓ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query successful:', result.rows[0]);
    
    await client.end();
    console.log('✓ Connection test passed!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\nTrying port 5432 (direct)...');
    
    const client2 = new Client({
      connectionString: 'postgresql://postgres:zebbut-gebpyd-8sywbA@db.ynhiqtergpyamssxyrnj.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      await client2.connect();
      console.log('✓ Port 5432 connected!');
      await client2.end();
    } catch (err2) {
      console.error('❌ Port 5432 also failed:', err2.message);
    }
  }
}

test();
