const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'your_database_name');
    
    console.log('🌱 Seeding merchant data...\n');

    // Get existing products for reviews
    const products = await db.collection('products').find({}).limit(5).toArray();
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Please seed products first using POST /api/products/seed');
      return;
    }

    // ─── ORDERS ───
    console.log('📦 Creating demo orders...');
    const orders = [
      {
        id: uuidv4(),
        order_number: 'ORD-1001',
        session_id: 'demo-session-1',
        items: [
          { product_id: products[0].id, name: products[0].name, price: products[0].price, quantity: 2, image: products[0].image }
        ],
        subtotal: products[0].price * 2,
        shipping: 5.00,
        tax: (products[0].price * 2 * 0.08),
        total: (products[0].price * 2) + 5.00 + (products[0].price * 2 * 0.08),
        status: 'delivered',
        payment_status: 'paid',
        stripe_session_id: 'cs_demo_' + uuidv4(),
        shipping_address: {
          name: 'Sarah Johnson',
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          country: 'USA'
        },
        tracking_number: '1Z999AA10123456784',
        carrier: 'UPS',
        notes: 'Please leave at door',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        order_number: 'ORD-1002',
        session_id: 'demo-session-2',
        items: [
          { product_id: products[1]?.id, name: products[1]?.name, price: products[1]?.price, quantity: 1, image: products[1]?.image },
          { product_id: products[2]?.id, name: products[2]?.name, price: products[2]?.price, quantity: 1, image: products[2]?.image }
        ],
        subtotal: (products[1]?.price || 0) + (products[2]?.price || 0),
        shipping: 0,
        tax: ((products[1]?.price || 0) + (products[2]?.price || 0)) * 0.08,
        total: ((products[1]?.price || 0) + (products[2]?.price || 0)) * 1.08,
        status: 'shipped',
        payment_status: 'paid',
        stripe_session_id: 'cs_demo_' + uuidv4(),
        shipping_address: {
          name: 'Michael Chen',
          street: '456 Oak Ave',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        tracking_number: '9400110200793597124125',
        carrier: 'USPS',
        notes: '',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        order_number: 'ORD-1003',
        session_id: 'demo-session-3',
        items: [
          { product_id: products[0]?.id, name: products[0]?.name, price: products[0]?.price, quantity: 3, image: products[0]?.image }
        ],
        subtotal: (products[0]?.price || 0) * 3,
        shipping: 5.00,
        tax: ((products[0]?.price || 0) * 3) * 0.08,
        total: ((products[0]?.price || 0) * 3) * 1.08 + 5.00,
        status: 'processing',
        payment_status: 'paid',
        stripe_session_id: 'cs_demo_' + uuidv4(),
        shipping_address: {
          name: 'Emily Rodriguez',
          street: '789 Pine Rd',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          country: 'USA'
        },
        tracking_number: null,
        carrier: null,
        notes: 'Gift wrapping requested',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        order_number: 'ORD-1004',
        session_id: 'demo-session-4',
        items: [
          { product_id: products[3]?.id, name: products[3]?.name, price: products[3]?.price, quantity: 1, image: products[3]?.image }
        ],
        subtotal: products[3]?.price || 0,
        shipping: 5.00,
        tax: (products[3]?.price || 0) * 0.08,
        total: ((products[3]?.price || 0) * 1.08) + 5.00,
        status: 'pending',
        payment_status: 'paid',
        stripe_session_id: 'cs_demo_' + uuidv4(),
        shipping_address: {
          name: 'David Kim',
          street: '321 Elm St',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          country: 'USA'
        },
        tracking_number: null,
        carrier: null,
        notes: '',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ];

    await db.collection('orders').deleteMany({ order_number: { $regex: /^ORD-100[1-4]$/ } });
    await db.collection('orders').insertMany(orders);
    console.log(`✓ Created ${orders.length} orders`);

    // ─── REVIEWS ───
    console.log('\n⭐ Creating demo reviews...');
    const reviews = [
      {
        id: uuidv4(),
        product_id: products[0].id,
        session_id: 'demo-session-1',
        author_name: 'Sarah J.',
        rating: 5,
        title: 'Absolutely amazing coffee!',
        content: 'This Ethiopian Yirgacheffe is exactly what I was looking for. The floral notes are incredible and it makes a perfect morning brew. Will definitely reorder!',
        status: 'published',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        product_id: products[1]?.id,
        session_id: 'demo-session-2',
        author_name: 'Michael C.',
        rating: 4,
        title: 'Great quality, fast shipping',
        content: 'Really enjoy the smooth taste. Just wish it came in a larger bag! Quality is top-notch though.',
        status: 'published',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        product_id: products[0].id,
        session_id: 'demo-session-5',
        author_name: 'Jennifer L.',
        rating: 5,
        title: 'My new favorite',
        content: 'I have tried many coffee brands and this one stands out. The taste is exceptional and the AI assistant helped me pick the perfect roast!',
        status: 'published',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        product_id: products[2]?.id,
        session_id: 'demo-session-6',
        author_name: 'Alex T.',
        rating: 4,
        title: 'Bold and flavorful',
        content: 'The Kenyan AA has a unique taste profile. Very bold, might be too strong for some but I love it.',
        status: 'published',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        product_id: products[1]?.id,
        session_id: 'demo-session-7',
        author_name: 'Anonymous',
        rating: 3,
        title: 'Decent but overpriced',
        content: 'Coffee is good but I think it is a bit expensive compared to other options.',
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await db.collection('reviews').deleteMany({ author_name: { $in: ['Sarah J.', 'Michael C.', 'Jennifer L.', 'Alex T.'] } });
    await db.collection('reviews').insertMany(reviews);
    console.log(`✓ Created ${reviews.length} reviews`);

    // ─── CAMPAIGNS ───
    console.log('\n📧 Creating demo campaigns...');
    const campaigns = [
      {
        id: uuidv4(),
        name: 'Welcome Series - New Customers',
        description: 'Automated email series for new customers with 10% discount code',
        type: 'email',
        status: 'active',
        audience_count: 142,
        sent_count: 98,
        open_rate: 42.5,
        content: {
          subject: 'Welcome to Artisan Coffee Roasters ☕',
          body: 'Thank you for joining us! Use code WELCOME10 for 10% off your first order.',
          cta: 'Shop Now'
        },
        scheduled_at: null,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        name: 'Spring Collection Launch',
        description: 'Announcing new single-origin beans from Costa Rica',
        type: 'email',
        status: 'scheduled',
        audience_count: 356,
        sent_count: 0,
        open_rate: 0,
        content: {
          subject: '🌸 New Spring Collection - Limited Edition',
          body: 'Discover our exclusive spring coffee collection featuring rare single-origin beans.',
          cta: 'Explore Collection'
        },
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        name: 'Cart Abandonment Recovery',
        description: 'Re-engage customers who left items in cart',
        type: 'email',
        status: 'active',
        audience_count: 89,
        sent_count: 67,
        open_rate: 38.2,
        content: {
          subject: 'You left something behind...',
          body: 'Complete your order and enjoy free shipping on orders over $50!',
          cta: 'Complete Purchase'
        },
        scheduled_at: null,
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        name: 'Loyalty Rewards Program',
        description: 'Monthly newsletter for VIP customers',
        type: 'email',
        status: 'draft',
        audience_count: 234,
        sent_count: 0,
        open_rate: 0,
        content: {
          subject: 'Exclusive rewards just for you',
          body: 'As a valued customer, you have earned 500 loyalty points. Redeem now!',
          cta: 'View Rewards'
        },
        scheduled_at: null,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    await db.collection('campaigns').deleteMany({ name: { $regex: /Welcome Series|Spring Collection|Cart Abandonment|Loyalty Rewards/ } });
    await db.collection('campaigns').insertMany(campaigns);
    console.log(`✓ Created ${campaigns.length} campaigns`);

    console.log('\n✨ Merchant data seeding complete!');
    console.log('You can now view Orders, Reviews, Shipments, and Campaigns in the merchant dashboard.');
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await client.close();
  }
}

seed();
