import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let mongoClient = null
let database = null

async function connectToMongo() {
  if (!database) {
    if (!mongoClient) {
      mongoClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
      await mongoClient.connect()
    }
    database = mongoClient.db(process.env.DB_NAME || 'your_database_name')
  }
  return database
}

function corsResponse(data, status = 200) {
  const res = NextResponse.json(data, { status })
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}

export async function OPTIONS() {
  return corsResponse({}, 200)
}

// ═══════════════════════════════════════════
// DEMO PRODUCTS - ARTISAN COFFEE ROASTERS
// ═══════════════════════════════════════════
const DEMO_PRODUCTS = [
  { id: uuidv4(), name: 'Ethiopian Yirgacheffe', description: 'Bright and citrusy with floral notes. Light roast single origin from the Yirgacheffe region. Tasting notes: bergamot, jasmine, lemon zest.', price: 18.99, compare_at_price: 24.99, category: 'Single Origin', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop', stock: 50, bargain_enabled: true, bargain_min_price: 14.99, tags: ['coffee', 'single origin', 'ethiopian', 'light roast'], weight: '340g' },
  { id: uuidv4(), name: 'Colombian Supremo', description: 'Smooth and nutty with rich chocolate undertones. Medium roast from Huila region. Tasting notes: dark chocolate, walnut, caramel.', price: 16.99, compare_at_price: 21.99, category: 'Single Origin', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', stock: 65, bargain_enabled: true, bargain_min_price: 13.99, tags: ['coffee', 'single origin', 'colombian', 'medium roast'], weight: '340g' },
  { id: uuidv4(), name: 'Kenyan AA', description: 'Bold and fruity with wine-like acidity. Medium-dark roast from Mount Kenya. Tasting notes: blackberry, tomato, brown sugar.', price: 19.99, compare_at_price: 25.99, category: 'Single Origin', image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop', stock: 35, bargain_enabled: true, bargain_min_price: 15.99, tags: ['coffee', 'single origin', 'kenyan', 'medium dark roast'], weight: '340g' },
  { id: uuidv4(), name: 'House Blend', description: 'Our signature everyday blend. Balanced, smooth, and endlessly drinkable. A harmonious mix of Central and South American beans.', price: 14.99, compare_at_price: 18.99, category: 'Blends', image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop&q=80', stock: 80, bargain_enabled: true, bargain_min_price: 11.99, tags: ['coffee', 'blend', 'house', 'everyday'], weight: '340g' },
  { id: uuidv4(), name: 'Dark Roast Blend', description: 'Rich, smoky, and bold. Our darkest roast for those who love deep, intense flavor. Notes of dark cocoa and toasted oak.', price: 15.99, compare_at_price: 19.99, category: 'Blends', image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop', stock: 55, bargain_enabled: true, bargain_min_price: 12.99, tags: ['coffee', 'blend', 'dark roast', 'bold'], weight: '340g' },
  { id: uuidv4(), name: 'Morning Sunrise Blend', description: 'Light and bright with citrus overtones. The perfect way to start your day. Crafted for pour-over and drip methods.', price: 13.99, compare_at_price: 17.99, category: 'Blends', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop', stock: 70, bargain_enabled: true, bargain_min_price: 10.99, tags: ['coffee', 'blend', 'light roast', 'morning'], weight: '340g' },
  { id: uuidv4(), name: 'Espresso Classico', description: 'Traditional Italian-style espresso with a thick, golden crema. Rich body with sweet chocolate finish.', price: 17.99, compare_at_price: 22.99, category: 'Espresso', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop', stock: 45, bargain_enabled: true, bargain_min_price: 14.99, tags: ['coffee', 'espresso', 'italian', 'crema'], weight: '340g' },
  { id: uuidv4(), name: 'Italian Roast Espresso', description: 'Deep, bold, and smoky. Our most intense espresso roast. Perfect for lattes and cappuccinos.', price: 19.99, compare_at_price: 24.99, category: 'Espresso', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=400&fit=crop', stock: 40, bargain_enabled: true, bargain_min_price: 15.99, tags: ['coffee', 'espresso', 'italian roast', 'dark'], weight: '340g' },
  { id: uuidv4(), name: 'Swiss Water Decaf', description: 'All the flavor, none of the caffeine. Chemical-free Swiss Water process preserves origin character.', price: 15.99, compare_at_price: 19.99, category: 'Decaf', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', stock: 30, bargain_enabled: true, bargain_min_price: 12.99, tags: ['coffee', 'decaf', 'swiss water', 'chemical free'], weight: '340g' },
  { id: uuidv4(), name: 'Decaf Colombian', description: 'Smooth, balanced decaffeinated Colombian. Same great taste, naturally decaffeinated.', price: 14.99, compare_at_price: 18.99, category: 'Decaf', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', stock: 25, bargain_enabled: true, bargain_min_price: 11.99, tags: ['coffee', 'decaf', 'colombian', 'smooth'], weight: '340g' },
  { id: uuidv4(), name: 'Bodum French Press', description: 'Classic 8-cup French press with stainless steel filter. The purest way to brew full-bodied coffee.', price: 34.99, compare_at_price: 44.99, category: 'Equipment', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', stock: 20, bargain_enabled: true, bargain_min_price: 27.99, tags: ['equipment', 'french press', 'brewing', 'glass'], weight: '680g' },
  { id: uuidv4(), name: 'Pour-Over Starter Kit', description: 'Complete pour-over set with ceramic dripper, glass server, paper filters, and measuring scoop.', price: 29.99, compare_at_price: 39.99, category: 'Equipment', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', stock: 15, bargain_enabled: true, bargain_min_price: 23.99, tags: ['equipment', 'pour over', 'starter kit', 'ceramic'], weight: '540g' },
  { id: uuidv4(), name: 'Ceramic Hand Grinder', description: 'Premium ceramic burr hand grinder with 15 grind settings. Consistent grounds for any brew method.', price: 49.99, compare_at_price: 64.99, category: 'Equipment', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop', stock: 12, bargain_enabled: true, bargain_min_price: 39.99, tags: ['equipment', 'grinder', 'ceramic', 'hand grinder'], weight: '450g' }
]

// ═══════════════════════════════════════════
// STORE CONFIGURATION
// ═══════════════════════════════════════════
const STORE_CONFIG = {
  name: 'Artisan Coffee Roasters',
  tagline: 'Best coffee in town',
  description: 'Premium single origin and blended coffees, roasted fresh to order.',
  banner: 'FREE GLOBAL SHIPPING ON ORDERS OVER $100 | USE CODE WELCOME TO GET 10% OFF',
  categories: ['All', 'Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment'],
  ai_name: 'Mark',
  ai_greeting: 'Hey! Welcome to our store. What are you shopping for today?',
  hero_image: 'https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1200&h=600&fit=crop',
  status: 'live'
}

// ═══════════════════════════════════════════
// AI CONFIGURATION
// ═══════════════════════════════════════════
const SYSTEM_PROMPT = `You are Mark, the friendly AI shopping assistant for Artisan Coffee Roasters. You help buyers find the perfect coffee through knowledgeable, warm conversation.

ABOUT THE STORE:
Artisan Coffee Roasters is a premium coffee shop offering single origin beans, blends, espresso roasts, decaf options, and brewing equipment. All coffee is roasted fresh to order.

PRODUCT CATEGORIES (use these exact names):
- Single Origin (Ethiopian, Colombian, Kenyan)
- Blends (House Blend, Dark Roast Blend, Morning Sunrise Blend)
- Espresso (Espresso Classico, Italian Roast Espresso)
- Decaf (Swiss Water Decaf, Decaf Colombian)
- Equipment (French Press, Pour-Over Kit, Grinder)

CAPABILITIES:
- Search and recommend coffees from the catalog
- Create persistent shopping missions for buyer goals
- Negotiate prices within merchant-approved boundaries
- Add items to cart and guide toward checkout
- Provide coffee expertise and brewing advice

PERSONALITY:
- Friendly and approachable (use casual tone, like a barista friend)
- Knowledgeable about coffee origins, roasts, and brewing
- Enthusiastic about great coffee
- Goal-oriented — guide toward finding the right coffee and checking out

RULES:
1. ALWAYS use search_products before recommending anything
2. When searching, use ONLY the query parameter (do not use category parameter unless user explicitly asks for a specific category)
3. For "blend" searches, search with query="blend" NOT category="coffee" 
4. When a buyer describes a goal, use create_mission to track it
5. For negotiations, respect the bargain_min_price boundary
6. Only recommend products from search results
7. When buyer seems ready, offer to generate checkout
8. Keep responses concise (2-4 sentences unless detail is needed)
9. Mention specific prices and savings when relevant
10. Be enthusiastic about good deals

SEARCH TOOL USAGE:
- General queries: search_products({ query: "user's search term" })
- Category-specific: search_products({ query: "blend" }) for blends
- Price filtering: search_products({ query: "ethiopian", max_price: 20 })
- DO NOT use category parameter unless user explicitly says "in the [category] category"

IMPORTANT: When showing products, mention them by name and price. If buyer asks to negotiate, use negotiate_price tool.`

const AI_TOOL_DEFS = [
  {
    name: 'search_products',
    description: 'Search the product catalog. Use this whenever the buyer is looking for something.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        category: { type: 'string', description: 'Product category filter' },
        max_price: { type: 'number', description: 'Maximum price filter' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_product_details',
    description: 'Get full details of a specific product by ID.',
    parameters: {
      type: 'object',
      properties: { product_id: { type: 'string', description: 'Product ID' } },
      required: ['product_id']
    }
  },
  {
    name: 'add_to_cart',
    description: 'Add a product to the buyer cart.',
    parameters: {
      type: 'object',
      properties: {
        product_id: { type: 'string', description: 'Product ID' },
        quantity: { type: 'number', description: 'Quantity', default: 1 }
      },
      required: ['product_id']
    }
  },
  {
    name: 'create_mission',
    description: 'Create a persistent shopping mission for a buyer goal, e.g. "Find a gift under $50 by Friday".',
    parameters: {
      type: 'object',
      properties: {
        goal: { type: 'string', description: 'The shopping goal description' },
        budget_max: { type: 'number', description: 'Maximum budget' },
        deadline: { type: 'string', description: 'Deadline if any' }
      },
      required: ['goal']
    }
  },
  {
    name: 'negotiate_price',
    description: 'Negotiate the price of a product. Returns the best offer within merchant boundaries.',
    parameters: {
      type: 'object',
      properties: {
        product_id: { type: 'string', description: 'Product ID to negotiate' },
        proposed_price: { type: 'number', description: 'Buyer proposed price' }
      },
      required: ['product_id', 'proposed_price']
    }
  },
  {
    name: 'generate_checkout',
    description: 'Generate a checkout link when the buyer is ready to purchase their cart.',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  }
]

const RESPONSES_API_TOOLS = AI_TOOL_DEFS.map(t => ({
  type: 'function', name: t.name, description: t.description, parameters: t.parameters
}))

const CHAT_COMPLETIONS_TOOLS = AI_TOOL_DEFS.map(t => ({
  type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters }
}))

// ═══════════════════════════════════════════
// AZURE OPENAI HELPERS
// ═══════════════════════════════════════════
async function callAI(conversationMsgs) {
  const baseUrl = process.env.AZURE_OPENAI_ENDPOINT.split('/openai/')[0]
  const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME
  const apiKey = process.env.AZURE_OPENAI_API_KEY
  const url = `${baseUrl}/openai/deployments/${model}/chat/completions?api-version=2025-04-01-preview`

  const messages = conversationMsgs.map(m => {
    if (m.tool_calls) {
      return {
        role: m.role,
        content: m.content || null,
        tool_calls: m.tool_calls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments }
        }))
      }
    }
    if (m.role === 'tool') return { role: 'tool', tool_call_id: m.tool_call_id, content: m.content }
    return { role: m.role, content: m.content }
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ messages, tools: CHAT_COMPLETIONS_TOOLS, temperature: 0.7, max_completion_tokens: 1500 })
  })
  if (!res.ok) {
    const errText = await res.text()
    console.error('Azure OpenAI error:', res.status, errText)
    throw new Error(`Azure OpenAI ${res.status}: ${errText.substring(0, 200)}`)
  }
  return await res.json()
}

function parseAIResponse(data) {
  if (data.choices && data.choices.length > 0) {
    const msg = data.choices[0].message
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      return {
        type: 'tool_calls',
        tool_calls: msg.tool_calls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments }
        }))
      }
    }
    return { type: 'text', content: msg.content || 'How can I help you today?' }
  }
  if (data.output && Array.isArray(data.output)) {
    const textParts = []
    const toolCalls = []
    for (const item of data.output) {
      if (item.type === 'message') {
        if (Array.isArray(item.content)) {
          for (const c of item.content) textParts.push(c.text || c.content || '')
        } else if (typeof item.content === 'string') textParts.push(item.content)
      } else if (item.type === 'function_call') {
        toolCalls.push({ id: item.call_id || item.id, type: 'function', function: { name: item.name, arguments: item.arguments } })
      }
    }
    if (toolCalls.length > 0) return { type: 'tool_calls', tool_calls: toolCalls, partial_text: textParts.join('') }
    return { type: 'text', content: textParts.join('') || 'How can I help you today?' }
  }
  if (data.error) {
    console.error('AI response error:', data.error)
    return { type: 'text', content: 'I apologize, I encountered a brief issue. Could you try again?' }
  }
  return { type: 'text', content: 'How can I help you today?' }
}

// ═══════════════════════════════════════════
// TOOL EXECUTION
// ═══════════════════════════════════════════
async function executeTool(name, argsStr, db, sessionId) {
  console.log('[TOOL] Executing:', name, 'Args:', argsStr);
  let args = {}
  try { args = JSON.parse(argsStr) } catch(e) { args = {} }

  switch (name) {
    case 'search_products': {
      const query = args.query || ''
      const filter = { status: { $ne: 'deleted' } }
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      }
      if (args.category) filter.category = { $regex: args.category, $options: 'i' }
      if (args.max_price) filter.price = { $lte: args.max_price }
      console.log('[SEARCH] Filter:', JSON.stringify(filter));
      const products = await db.collection('products').find(filter).limit(6).toArray()
      console.log('[SEARCH] Found:', products.length, 'products');
      const clean = products.map(({ _id, ...p }) => p)
      await logIntent(db, sessionId, 'search', `Searched: "${query}"${args.max_price ? ` under $${args.max_price}` : ''}`, { query, results: clean.length })
      return JSON.stringify({ products: clean, count: clean.length })
    }
    case 'get_product_details': {
      const product = await db.collection('products').findOne({ id: args.product_id })
      if (!product) return JSON.stringify({ error: 'Product not found' })
      const { _id, ...clean } = product
      return JSON.stringify(clean)
    }
    case 'add_to_cart': {
      const product = await db.collection('products').findOne({ id: args.product_id })
      if (!product) return JSON.stringify({ error: 'Product not found' })
      const conv = await db.collection('conversations').findOne({ session_id: sessionId })
      const cart = conv?.cart || []
      const existing = cart.find(i => i.product_id === args.product_id)
      if (existing) {
        existing.quantity += (args.quantity || 1)
      } else {
        cart.push({ product_id: product.id, name: product.name, price: product.price, image: product.image, quantity: args.quantity || 1 })
      }
      await db.collection('conversations').updateOne({ session_id: sessionId }, { $set: { cart, updated_at: new Date() } })
      await logIntent(db, sessionId, 'add_to_cart', `Added ${product.name} to cart`, { product_id: product.id, price: product.price })
      await updateConsumerProfile(db, sessionId, { action: 'add_to_cart', value: product.price })
      return JSON.stringify({ success: true, cart, message: `${product.name} added to cart` })
    }
    case 'create_mission': {
      const mission = {
        id: uuidv4(), session_id: sessionId, goal: args.goal,
        budget_max: args.budget_max || null, deadline: args.deadline || null,
        status: 'active', progress: 10, steps: [{ action: 'created', description: 'Mission initiated', timestamp: new Date() }],
        created_at: new Date(), updated_at: new Date()
      }
      await db.collection('missions').insertOne(mission)
      await logIntent(db, sessionId, 'mission_create', `Mission: "${args.goal}"`, { mission_id: mission.id, budget: args.budget_max })
      return JSON.stringify({ success: true, mission: { id: mission.id, goal: mission.goal, status: 'active', progress: 10 } })
    }
    case 'negotiate_price': {
      const product = await db.collection('products').findOne({ id: args.product_id })
      if (!product) return JSON.stringify({ error: 'Product not found' })
      if (!product.bargain_enabled) return JSON.stringify({ error: 'This product is not available for negotiation', product_name: product.name })
      const proposed = args.proposed_price
      const minPrice = product.bargain_min_price
      const originalPrice = product.price
      let finalPrice, status, message
      if (proposed >= originalPrice) {
        finalPrice = originalPrice; status = 'accepted'; message = `Great news! The original price of $${originalPrice} is already a great deal.`
      } else if (proposed >= minPrice) {
        finalPrice = Math.max(proposed, minPrice); status = 'accepted'
        const savings = (originalPrice - finalPrice).toFixed(2)
        message = `Deal! I can offer ${product.name} at $${finalPrice.toFixed(2)} — you save $${savings}!`
      } else if (proposed >= minPrice * 0.9) {
        finalPrice = minPrice; status = 'counter'
        message = `I can't go that low, but I can offer $${minPrice.toFixed(2)} — that's ${Math.round((1 - minPrice/originalPrice) * 100)}% off!`
      } else {
        finalPrice = minPrice; status = 'counter'
        message = `The best I can offer is $${minPrice.toFixed(2)}. That's already ${Math.round((1 - minPrice/originalPrice) * 100)}% below retail.`
      }
      await logIntent(db, sessionId, 'negotiate', `Negotiation on ${product.name}: $${proposed} → $${finalPrice}`, { product_id: product.id, proposed, final: finalPrice, status })
      if (status === 'accepted') {
        await db.collection('conversations').updateOne(
          { session_id: sessionId, 'cart.product_id': product.id },
          { $set: { 'cart.$.price': finalPrice, 'cart.$.negotiated': true } }
        )
      }
      return JSON.stringify({ status, original_price: originalPrice, proposed_price: proposed, final_price: finalPrice, product_name: product.name, message })
    }
    case 'generate_checkout': {
      const conv = await db.collection('conversations').findOne({ session_id: sessionId })
      const cart = conv?.cart || []
      if (cart.length === 0) return JSON.stringify({ error: 'Cart is empty. Add items first.' })
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      try {
        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.create({
          line_items: cart.map(item => ({
            price_data: { currency: 'usd', product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) },
            quantity: item.quantity
          })),
          mode: 'payment',
          success_url: `${baseUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}?checkout=cancel`,
          metadata: { convos_session_id: sessionId }
        })
        await logIntent(db, sessionId, 'checkout', `Checkout initiated: $${total.toFixed(2)}`, { total, items: cart.length, stripe_session: session.id })
        await updateConsumerProfile(db, sessionId, { action: 'checkout', value: total })
        return JSON.stringify({ success: true, checkout_url: session.url, total: total.toFixed(2) })
      } catch(e) {
        console.error('Stripe error:', e)
        return JSON.stringify({ error: 'Checkout is temporarily unavailable. Please try again.' })
      }
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` })
  }
}

async function logIntent(db, sessionId, type, description, metadata = {}) {
  await db.collection('intents').insertOne({
    id: uuidv4(), session_id: sessionId, type, description, metadata, timestamp: new Date()
  })
}

async function updateConsumerProfile(db, sessionId, update) {
  const profile = await db.collection('consumer_profiles').findOne({ session_id: sessionId })
  if (!profile) {
    await db.collection('consumer_profiles').insertOne({
      id: uuidv4(), session_id: sessionId, trust_score: 80, risk_level: 'low',
      total_orders: 0, total_spent: 0, interactions: 1, preferences: {}, traits: [],
      created_at: new Date(), updated_at: new Date()
    })
    return
  }
  const updates = { updated_at: new Date(), interactions: (profile.interactions || 0) + 1 }
  if (update.action === 'add_to_cart') updates.trust_score = Math.min(100, (profile.trust_score || 80) + 2)
  if (update.action === 'checkout') {
    updates.trust_score = Math.min(100, (profile.trust_score || 80) + 5)
    updates.total_spent = (profile.total_spent || 0) + (update.value || 0)
    updates.total_orders = (profile.total_orders || 0) + 1
  }
  await db.collection('consumer_profiles').updateOne({ session_id: sessionId }, { $set: updates })
}

// ═══════════════════════════════════════════
// ROUTE HANDLER
// ═══════════════════════════════════════════
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Health check
    if ((route === '/' || route === '/health') && method === 'GET') {
      return corsResponse({ status: 'ok', platform: 'Convos Agentic Commerce', version: '2.0' })
    }

    // ─── Store Config ───
    if (route === '/store' && method === 'GET') {
      return corsResponse(STORE_CONFIG)
    }

    // ═══════════════════════════════════════════
    // PRODUCTS - FULL CRUD
    // ═══════════════════════════════════════════

    // GET /api/products - List all products
    if (route === '/products' && method === 'GET') {
      const products = await db.collection('products').find({ status: { $ne: 'deleted' } }).toArray()
      return corsResponse(products.map(({ _id, ...p }) => p))
    }

    // GET /api/products/:id - Get single product
    if (route.match(/^\/products\/[^/]+$/) && !route.includes('/seed') && method === 'GET') {
      const productId = route.split('/')[2]
      const product = await db.collection('products').findOne({ id: productId })
      if (!product) return corsResponse({ error: 'Product not found' }, 404)
      const { _id, ...clean } = product
      return corsResponse(clean)
    }

    // POST /api/products - Create new product
    if (route === '/products' && method === 'POST') {
      const body = await request.json()
      const product = {
        id: uuidv4(),
        name: body.name || 'Untitled Product',
        description: body.description || '',
        price: parseFloat(body.price) || 0,
        compare_at_price: parseFloat(body.compare_at_price) || 0,
        category: body.category || 'Uncategorized',
        image: body.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
        stock: parseInt(body.stock) || 0,
        bargain_enabled: body.bargain_enabled ?? true,
        bargain_min_price: parseFloat(body.bargain_min_price) || parseFloat(body.price) * 0.8 || 0,
        tags: body.tags || [],
        weight: body.weight || '',
        status: body.status || 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
      await db.collection('products').insertOne(product)
      const { _id, ...clean } = product
      return corsResponse(clean, 201)
    }

    // PUT /api/products/:id - Update product
    if (route.match(/^\/products\/[^/]+$/) && !route.includes('/seed') && method === 'PUT') {
      const productId = route.split('/')[2]
      const body = await request.json()
      
      const updateFields = {}
      if (body.name !== undefined) updateFields.name = body.name
      if (body.description !== undefined) updateFields.description = body.description
      if (body.price !== undefined) updateFields.price = parseFloat(body.price)
      if (body.compare_at_price !== undefined) updateFields.compare_at_price = parseFloat(body.compare_at_price)
      if (body.category !== undefined) updateFields.category = body.category
      if (body.image !== undefined) updateFields.image = body.image
      if (body.stock !== undefined) updateFields.stock = parseInt(body.stock)
      if (body.bargain_enabled !== undefined) updateFields.bargain_enabled = body.bargain_enabled
      if (body.bargain_min_price !== undefined) updateFields.bargain_min_price = parseFloat(body.bargain_min_price)
      if (body.tags !== undefined) updateFields.tags = body.tags
      if (body.weight !== undefined) updateFields.weight = body.weight
      if (body.status !== undefined) updateFields.status = body.status
      updateFields.updated_at = new Date()

      const result = await db.collection('products').updateOne(
        { id: productId },
        { $set: updateFields }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Product not found' }, 404)
      
      const updated = await db.collection('products').findOne({ id: productId })
      const { _id, ...clean } = updated
      return corsResponse(clean)
    }

    // DELETE /api/products/:id - Soft delete product
    if (route.match(/^\/products\/[^/]+$/) && method === 'DELETE') {
      const productId = route.split('/')[2]
      const result = await db.collection('products').updateOne(
        { id: productId },
        { $set: { status: 'deleted', updated_at: new Date() } }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Product not found' }, 404)
      return corsResponse({ success: true, message: 'Product deleted' })
    }

    // POST /api/products/seed - Seed demo products
    if (route === '/products/seed' && method === 'POST') {
      const existing = await db.collection('products').countDocuments()
      if (existing >= 10 && existing <= 15) return corsResponse({ message: 'Products already seeded', count: existing })
      await db.collection('products').deleteMany({})
      const products = DEMO_PRODUCTS.map(p => ({ ...p, status: 'active', created_at: new Date(), updated_at: new Date() }))
      await db.collection('products').insertMany(products)
      return corsResponse({ message: 'Products seeded', count: products.length })
    }

    // ─── AI Chat ───
    if (route === '/ai/chat' && method === 'POST') {
      const body = await request.json()
      const { session_id, message } = body
      if (!session_id || !message) return corsResponse({ error: 'session_id and message required' }, 400)

      let conv = await db.collection('conversations').findOne({ session_id })
      if (!conv) {
        conv = { id: uuidv4(), session_id, messages: [], cart: [], created_at: new Date(), updated_at: new Date() }
        await db.collection('conversations').insertOne(conv)
      }

      await updateConsumerProfile(db, session_id, { action: 'message' })

      conv.messages.push({ role: 'user', content: message, timestamp: new Date() })
      await logIntent(db, session_id, 'message', `Buyer: "${message.substring(0, 100)}"`, {})

      const aiMessages = [{ role: 'system', content: SYSTEM_PROMPT }]
      const recentMsgs = conv.messages.slice(-20)
      for (const m of recentMsgs) {
        if (m.role === 'assistant' && m.tool_calls) {
          aiMessages.push({ role: 'assistant', content: m.content || null, tool_calls: m.tool_calls })
        } else if (m.role === 'tool') {
          aiMessages.push({ role: 'tool', tool_call_id: m.tool_call_id, content: m.content })
        } else {
          aiMessages.push({ role: m.role, content: m.content })
        }
      }

      let finalText = ''
      let productsFound = []
      let missionCreated = null
      let negotiationResult = null
      let checkoutUrl = null
      let cartUpdated = false

      for (let iteration = 0; iteration < 5; iteration++) {
        const aiResult = await callAI(aiMessages)
        const parsed = parseAIResponse(aiResult)

        if (parsed.type === 'text') {
          finalText = parsed.content
          conv.messages.push({ role: 'assistant', content: finalText, timestamp: new Date() })
          break
        }

        if (parsed.type === 'tool_calls') {
          const assistantMsg = { role: 'assistant', content: parsed.partial_text || null, tool_calls: parsed.tool_calls, timestamp: new Date() }
          conv.messages.push(assistantMsg)
          aiMessages.push({ role: 'assistant', content: parsed.partial_text || null, tool_calls: parsed.tool_calls })

          for (const tc of parsed.tool_calls) {
            const toolResult = await executeTool(tc.function.name, tc.function.arguments, db, session_id)
            conv.messages.push({ role: 'tool', tool_call_id: tc.id, content: toolResult, timestamp: new Date() })
            aiMessages.push({ role: 'tool', tool_call_id: tc.id, content: toolResult })

            try {
              const result = JSON.parse(toolResult)
              if (result.products) productsFound = result.products
              if (result.mission) missionCreated = result.mission
              if (result.status && result.final_price) negotiationResult = result
              if (result.checkout_url) checkoutUrl = result.checkout_url
              if (result.cart) cartUpdated = true
            } catch(e) {}
          }
          continue
        }
        break
      }

      if (!finalText) finalText = 'I\'ve processed your request. What would you like to do next?'

      const updatedConv = await db.collection('conversations').findOne({ session_id })
      const currentCart = updatedConv?.cart || conv.cart || []

      await db.collection('conversations').updateOne(
        { session_id },
        { $set: { messages: conv.messages, updated_at: new Date() } }
      )

      const missions = await db.collection('missions').find({ session_id, status: 'active' }).toArray()

      return corsResponse({
        response: {
          text: finalText,
          products: productsFound,
          mission_created: missionCreated,
          negotiation: negotiationResult,
          checkout_url: checkoutUrl,
          cart_updated: cartUpdated
        },
        cart: currentCart,
        missions: missions.map(({ _id, ...m }) => m),
        session_id
      })
    }

    // ─── Missions ───
    if (route === '/missions' && method === 'GET') {
      const sessionId = request.nextUrl.searchParams.get('session_id')
      const filter = sessionId ? { session_id: sessionId } : {}
      const missions = await db.collection('missions').find(filter).sort({ created_at: -1 }).limit(50).toArray()
      return corsResponse(missions.map(({ _id, ...m }) => m))
    }

    // ─── Intent Stream (Merchant) ───
    if (route === '/intents' && method === 'GET') {
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
      const since = request.nextUrl.searchParams.get('since')
      const filter = since ? { timestamp: { $gt: new Date(since) } } : {}
      const intents = await db.collection('intents').find(filter).sort({ timestamp: -1 }).limit(limit).toArray()
      return corsResponse(intents.map(({ _id, ...i }) => i))
    }

    // ─── Consumer Matrix (Merchant) ───
    if (route === '/consumer-matrix' && method === 'GET') {
      const profiles = await db.collection('consumer_profiles').find({}).sort({ updated_at: -1 }).limit(50).toArray()
      return corsResponse(profiles.map(({ _id, ...p }) => p))
    }

    // ─── Cart ───
    if (route === '/cart' && method === 'GET') {
      const sessionId = request.nextUrl.searchParams.get('session_id')
      if (!sessionId) return corsResponse({ error: 'session_id required' }, 400)
      const conv = await db.collection('conversations').findOne({ session_id: sessionId })
      return corsResponse({ cart: conv?.cart || [] })
    }

    // ─── Checkout ───
    if (route === '/checkout' && method === 'POST') {
      const body = await request.json()
      const { session_id, items, orderId, customerEmail } = body
      
      let cart = items || []
      if (!cart.length && session_id) {
        const conv = await db.collection('conversations').findOne({ session_id })
        cart = conv?.cart || []
      }
      
      if (cart.length === 0) return corsResponse({ error: 'Cart is empty' }, 400)
      
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      try {
        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.create({
          line_items: cart.map(item => ({
            price_data: { 
              currency: 'usd', 
              product_data: { 
                name: item.name,
                images: item.image ? [item.image] : []
              }, 
              unit_amount: Math.round(item.price * 100) 
            },
            quantity: item.quantity
          })),
          mode: 'payment',
          customer_email: customerEmail,
          success_url: `${baseUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/checkout?checkout=cancel`,
          metadata: { 
            convos_session_id: session_id || 'guest',
            order_id: orderId || ''
          }
        })
        return corsResponse({ url: session.url, session_id: session.id })
      } catch(e) {
        console.error('Stripe error:', e)
        return corsResponse({ error: 'Checkout unavailable: ' + e.message }, 500)
      }
    }

    // ─── Approvals (Merchant) ───
    if (route === '/approvals' && method === 'GET') {
      const approvals = await db.collection('approvals').find({ status: 'pending' }).sort({ created_at: -1 }).toArray()
      return corsResponse(approvals.map(({ _id, ...a }) => a))
    }

    // ─── Authentication ───
    if (route === '/auth/signup' && method === 'POST') {
      const body = await request.json()
      const existingUser = await db.collection('users').findOne({ email: body.email })
      
      if (existingUser) {
        return corsResponse({ success: false, message: 'Email already exists' }, 400)
      }

      const user = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        password: body.password,
        type: body.type || 'customer',
        created_at: new Date()
      }

      await db.collection('users').insertOne(user)
      const { password, _id, ...userWithoutPassword } = user
      return corsResponse({ success: true, user: userWithoutPassword })
    }

    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const user = await db.collection('users').findOne({ 
        email: body.email, 
        password: body.password,
        type: body.type 
      })

      if (!user) {
        return corsResponse({ success: false, message: 'Invalid credentials' }, 401)
      }

      const { password, _id, ...userWithoutPassword } = user
      return corsResponse({ success: true, user: userWithoutPassword })
    }

    if (route === '/auth/me' && method === 'GET') {
      const userId = request.headers.get('x-user-id')
      if (!userId) {
        return corsResponse({ success: false, message: 'Not authenticated' }, 401)
      }

      const user = await db.collection('users').findOne({ id: userId })
      if (!user) {
        return corsResponse({ success: false, message: 'User not found' }, 404)
      }

      const { password, _id, ...userWithoutPassword } = user
      return corsResponse({ success: true, user: userWithoutPassword })
    }

    // ═══════════════════════════════════════════
    // STATS (Merchant Dashboard)
    // ═══════════════════════════════════════════
    if (route === '/stats' && method === 'GET') {
      const totalProducts = await db.collection('products').countDocuments({ status: { $ne: 'deleted' } })
      const totalConversations = await db.collection('conversations').countDocuments()
      const totalMissions = await db.collection('missions').countDocuments()
      const activeMissions = await db.collection('missions').countDocuments({ status: 'active' })
      const totalIntents = await db.collection('intents').countDocuments()
      const recentIntents = await db.collection('intents').countDocuments({ timestamp: { $gt: new Date(Date.now() - 3600000) } })
      const profiles = await db.collection('consumer_profiles').find({}).toArray()
      const avgTrust = profiles.length ? (profiles.reduce((s, p) => s + (p.trust_score || 80), 0) / profiles.length).toFixed(1) : 80
      const totalOrders = await db.collection('orders').countDocuments()
      const totalRevenue = await db.collection('orders').aggregate([
        { $match: { payment_status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).toArray()
      
      // Order status breakdown
      const pendingOrders = await db.collection('orders').countDocuments({ status: 'pending' })
      const processingOrders = await db.collection('orders').countDocuments({ status: 'processing' })
      const shippedOrders = await db.collection('orders').countDocuments({ status: 'shipped' })
      const deliveredOrders = await db.collection('orders').countDocuments({ status: 'delivered' })
      
      // Reviews stats
      const totalReviews = await db.collection('reviews').countDocuments()
      const pendingReviews = await db.collection('reviews').countDocuments({ status: 'pending' })
      const avgRating = await db.collection('reviews').aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ]).toArray()

      return corsResponse({ 
        totalProducts, totalConversations, totalMissions, activeMissions, 
        totalIntents, recentIntents, avgTrustScore: parseFloat(avgTrust), 
        totalBuyers: profiles.length, totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders, processingOrders, shippedOrders, deliveredOrders,
        totalReviews, pendingReviews,
        avgRating: avgRating[0]?.avg?.toFixed(1) || '0.0'
      })
    }

    // ═══════════════════════════════════════════
    // ORDERS - FULL CRUD
    // ═══════════════════════════════════════════

    // GET /api/orders - List all orders
    if (route === '/orders' && method === 'GET') {
      const status = request.nextUrl.searchParams.get('status')
      const search = request.nextUrl.searchParams.get('search')
      const filter = {}
      if (status && status !== 'all') filter.status = status
      if (search) {
        filter.$or = [
          { order_number: { $regex: search, $options: 'i' } },
          { 'shipping_address.name': { $regex: search, $options: 'i' } },
          { 'shipping_address.email': { $regex: search, $options: 'i' } }
        ]
      }
      const orders = await db.collection('orders').find(filter).sort({ created_at: -1 }).limit(100).toArray()
      return corsResponse(orders.map(({ _id, ...o }) => o))
    }

    // GET /api/orders/:id - Get single order
    if (route.match(/^\/orders\/[^/]+$/) && method === 'GET') {
      const orderId = route.split('/')[2]
      const order = await db.collection('orders').findOne({ id: orderId })
      if (!order) return corsResponse({ error: 'Order not found' }, 404)
      const { _id, ...clean } = order
      return corsResponse(clean)
    }

    // POST /api/orders - Create order
    if (route === '/orders' && method === 'POST') {
      const body = await request.json()
      const order = {
        id: uuidv4(),
        order_number: `ORD-${Date.now()}`,
        session_id: body.session_id || 'unknown',
        items: body.items || [],
        subtotal: body.subtotal || 0,
        shipping: body.shipping || 0,
        tax: body.tax || 0,
        total: body.total || 0,
        status: body.status || 'pending',
        payment_status: body.payment_status || 'unpaid',
        stripe_session_id: body.stripe_session_id || null,
        shipping_address: body.shipping_address || null,
        tracking_number: body.tracking_number || null,
        carrier: body.carrier || null,
        notes: body.notes || '',
        created_at: new Date(),
        updated_at: new Date()
      }
      await db.collection('orders').insertOne(order)
      const { _id, ...clean } = order
      return corsResponse(clean, 201)
    }

    // PUT /api/orders/:id - Update order
    if (route.match(/^\/orders\/[^/]+$/) && method === 'PUT') {
      const orderId = route.split('/')[2]
      const body = await request.json()
      const updateFields = { ...body, updated_at: new Date() }
      delete updateFields.id
      delete updateFields._id
      
      const result = await db.collection('orders').updateOne(
        { id: orderId },
        { $set: updateFields }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Order not found' }, 404)
      
      const updated = await db.collection('orders').findOne({ id: orderId })
      const { _id, ...clean } = updated
      return corsResponse(clean)
    }

    // DELETE /api/orders/:id - Delete order
    if (route.match(/^\/orders\/[^/]+$/) && method === 'DELETE') {
      const orderId = route.split('/')[2]
      const result = await db.collection('orders').deleteOne({ id: orderId })
      if (result.deletedCount === 0) return corsResponse({ error: 'Order not found' }, 404)
      return corsResponse({ success: true, message: 'Order deleted' })
    }

    // ═══════════════════════════════════════════
    // SHIPMENTS
    // ═══════════════════════════════════════════

    // GET /api/shipments - List shipments
    if (route === '/shipments' && method === 'GET') {
      const shipments = await db.collection('orders').find({
        status: { $in: ['processing', 'shipped', 'delivered'] }
      }).sort({ updated_at: -1 }).limit(50).toArray()
      return corsResponse(shipments.map(({ _id, ...s }) => s))
    }

    // PUT /api/shipments/:id - Update shipment tracking
    if (route.match(/^\/shipments\/[^/]+$/) && method === 'PUT') {
      const orderId = route.split('/')[2]
      const body = await request.json()
      const updateFields = { updated_at: new Date() }
      if (body.tracking_number !== undefined) updateFields.tracking_number = body.tracking_number
      if (body.carrier !== undefined) updateFields.carrier = body.carrier
      if (body.status !== undefined) updateFields.status = body.status
      if (body.notes !== undefined) updateFields.notes = body.notes

      const result = await db.collection('orders').updateOne(
        { id: orderId },
        { $set: updateFields }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Shipment not found' }, 404)
      
      const updated = await db.collection('orders').findOne({ id: orderId })
      const { _id, ...clean } = updated
      return corsResponse(clean)
    }

    // ═══════════════════════════════════════════
    // REVIEWS - FULL CRUD
    // ═══════════════════════════════════════════

    // GET /api/reviews - List reviews
    if (route === '/reviews' && method === 'GET') {
      const status = request.nextUrl.searchParams.get('status')
      const filter = {}
      if (status && status !== 'all') filter.status = status
      
      const reviews = await db.collection('reviews').find(filter).sort({ created_at: -1 }).limit(100).toArray()
      const reviewsWithProducts = await Promise.all(reviews.map(async (r) => {
        if (r.product_id) {
          const product = await db.collection('products').findOne({ id: r.product_id })
          return { ...r, _id: undefined, product: product ? { id: product.id, name: product.name, image: product.image } : null }
        }
        return { ...r, _id: undefined, product: null }
      }))
      return corsResponse(reviewsWithProducts)
    }

    // POST /api/reviews - Create review
    if (route === '/reviews' && method === 'POST') {
      const body = await request.json()
      const review = {
        id: uuidv4(),
        product_id: body.product_id,
        session_id: body.session_id || 'anonymous',
        author_name: body.author_name || 'Anonymous',
        rating: body.rating,
        title: body.title || '',
        content: body.content || '',
        merchant_reply: body.merchant_reply || null,
        status: body.status || 'pending',
        created_at: new Date(),
        updated_at: new Date()
      }
      await db.collection('reviews').insertOne(review)
      const { _id, ...clean } = review
      return corsResponse(clean, 201)
    }

    // PUT /api/reviews/:id - Update review (status, merchant reply)
    if (route.match(/^\/reviews\/[^/]+$/) && method === 'PUT') {
      const reviewId = route.split('/')[2]
      const body = await request.json()
      const updateFields = { updated_at: new Date() }
      if (body.status !== undefined) updateFields.status = body.status
      if (body.merchant_reply !== undefined) updateFields.merchant_reply = body.merchant_reply
      if (body.title !== undefined) updateFields.title = body.title
      if (body.content !== undefined) updateFields.content = body.content
      
      const result = await db.collection('reviews').updateOne(
        { id: reviewId },
        { $set: updateFields }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Review not found' }, 404)
      
      const updated = await db.collection('reviews').findOne({ id: reviewId })
      const { _id, ...clean } = updated
      return corsResponse(clean)
    }

    // DELETE /api/reviews/:id - Delete review
    if (route.match(/^\/reviews\/[^/]+$/) && method === 'DELETE') {
      const reviewId = route.split('/')[2]
      const result = await db.collection('reviews').deleteOne({ id: reviewId })
      if (result.deletedCount === 0) return corsResponse({ error: 'Review not found' }, 404)
      return corsResponse({ success: true, message: 'Review deleted' })
    }

    // ═══════════════════════════════════════════
    // STORE CONFIG
    // ═══════════════════════════════════════════

    if (route === '/store-config' && method === 'GET') {
      let config = await db.collection('store_config').findOne({})
      if (!config) {
        config = {
          id: uuidv4(),
          name: STORE_CONFIG.name,
          tagline: STORE_CONFIG.tagline,
          description: STORE_CONFIG.description,
          banner: STORE_CONFIG.banner,
          categories: STORE_CONFIG.categories,
          ai_name: STORE_CONFIG.ai_name,
          ai_greeting: STORE_CONFIG.ai_greeting,
          hero_image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
          logo_url: '',
          theme: {},
          status: 'live',
          created_at: new Date(),
          updated_at: new Date()
        }
        await db.collection('store_config').insertOne(config)
      }
      const { _id, ...cfg } = config
      return corsResponse(cfg)
    }

    if (route === '/store-config' && method === 'PUT') {
      const body = await request.json()
      await db.collection('store_config').updateOne(
        {},
        { $set: { ...body, updated_at: new Date() } },
        { upsert: true }
      )
      return corsResponse({ success: true })
    }

    // ═══════════════════════════════════════════
    // CAMPAIGNS - FULL CRUD
    // ═══════════════════════════════════════════

    // GET /api/campaigns - List campaigns
    if (route === '/campaigns' && method === 'GET') {
      const status = request.nextUrl.searchParams.get('status')
      const filter = {}
      if (status && status !== 'all') filter.status = status
      const campaigns = await db.collection('campaigns').find(filter).sort({ created_at: -1 }).toArray()
      return corsResponse(campaigns.map(({ _id, ...c }) => c))
    }

    // POST /api/campaigns - Create campaign
    if (route === '/campaigns' && method === 'POST') {
      const body = await request.json()
      const campaign = {
        id: uuidv4(),
        name: body.name || 'Untitled Campaign',
        description: body.description || '',
        type: body.type || 'email',
        status: body.status || 'draft',
        audience_count: parseInt(body.audience_count) || 0,
        sent_count: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0,
        content: body.content || {},
        scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null,
        created_at: new Date(),
        updated_at: new Date()
      }
      await db.collection('campaigns').insertOne(campaign)
      const { _id, ...clean } = campaign
      return corsResponse(clean, 201)
    }

    // PUT /api/campaigns/:id - Update campaign
    if (route.match(/^\/campaigns\/[^/]+$/) && method === 'PUT') {
      const campaignId = route.split('/')[2]
      const body = await request.json()
      const updateFields = { updated_at: new Date() }
      if (body.name !== undefined) updateFields.name = body.name
      if (body.description !== undefined) updateFields.description = body.description
      if (body.type !== undefined) updateFields.type = body.type
      if (body.status !== undefined) updateFields.status = body.status
      if (body.audience_count !== undefined) updateFields.audience_count = parseInt(body.audience_count)
      if (body.content !== undefined) updateFields.content = body.content
      if (body.scheduled_at !== undefined) updateFields.scheduled_at = body.scheduled_at ? new Date(body.scheduled_at) : null
      
      const result = await db.collection('campaigns').updateOne(
        { id: campaignId },
        { $set: updateFields }
      )
      if (result.matchedCount === 0) return corsResponse({ error: 'Campaign not found' }, 404)
      
      const updated = await db.collection('campaigns').findOne({ id: campaignId })
      const { _id, ...clean } = updated
      return corsResponse(clean)
    }

    // DELETE /api/campaigns/:id - Delete campaign
    if (route.match(/^\/campaigns\/[^/]+$/) && method === 'DELETE') {
      const campaignId = route.split('/')[2]
      const result = await db.collection('campaigns').deleteOne({ id: campaignId })
      if (result.deletedCount === 0) return corsResponse({ error: 'Campaign not found' }, 404)
      return corsResponse({ success: true, message: 'Campaign deleted' })
    }

    // ═══════════════════════════════════════════
    // CUSTOMERS (Consumer Profiles)
    // ═══════════════════════════════════════════

    // GET /api/customers/:id - Get single customer profile
    if (route.match(/^\/customers\/[^/]+$/) && method === 'GET') {
      const customerId = route.split('/')[2]
      const profile = await db.collection('consumer_profiles').findOne({ id: customerId })
      if (!profile) return corsResponse({ error: 'Customer not found' }, 404)
      
      // Get their conversations and orders
      const conversations = await db.collection('conversations').find({ session_id: profile.session_id }).toArray()
      const intents = await db.collection('intents').find({ session_id: profile.session_id }).sort({ timestamp: -1 }).limit(20).toArray()
      
      const { _id, ...clean } = profile
      return corsResponse({
        ...clean,
        conversations: conversations.map(({ _id, messages, ...c }) => ({ ...c, message_count: messages?.length || 0 })),
        recent_activity: intents.map(({ _id, ...i }) => i)
      })
    }

    // ═══════════════════════════════════════════
    // EXPORT ENDPOINTS
    // ═══════════════════════════════════════════

    // GET /api/export/orders - Export orders as JSON (can be converted to CSV on frontend)
    if (route === '/export/orders' && method === 'GET') {
      const orders = await db.collection('orders').find({}).sort({ created_at: -1 }).toArray()
      const exportData = orders.map(({ _id, ...o }) => ({
        order_number: o.order_number,
        customer_name: o.shipping_address?.name || 'N/A',
        customer_email: o.shipping_address?.email || 'N/A',
        items: o.items?.map(i => `${i.name} x${i.quantity}`).join('; ') || '',
        subtotal: o.subtotal,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total,
        status: o.status,
        payment_status: o.payment_status,
        tracking_number: o.tracking_number || '',
        carrier: o.carrier || '',
        created_at: o.created_at,
        notes: o.notes || ''
      }))
      return corsResponse(exportData)
    }

    // GET /api/export/products - Export products
    if (route === '/export/products' && method === 'GET') {
      const products = await db.collection('products').find({ status: { $ne: 'deleted' } }).toArray()
      const exportData = products.map(({ _id, ...p }) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        compare_at_price: p.compare_at_price,
        category: p.category,
        stock: p.stock,
        status: p.status,
        bargain_enabled: p.bargain_enabled,
        bargain_min_price: p.bargain_min_price,
        tags: p.tags?.join(', ') || '',
        weight: p.weight
      }))
      return corsResponse(exportData)
    }

    // GET /api/export/customers - Export customers
    if (route === '/export/customers' && method === 'GET') {
      const profiles = await db.collection('consumer_profiles').find({}).toArray()
      const exportData = profiles.map(({ _id, ...p }) => ({
        session_id: p.session_id,
        trust_score: p.trust_score,
        risk_level: p.risk_level,
        total_orders: p.total_orders,
        total_spent: p.total_spent,
        interactions: p.interactions,
        created_at: p.created_at
      }))
      return corsResponse(exportData)
    }

    return corsResponse({ error: `Route ${route} not found` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return corsResponse({ error: 'Internal server error', details: error.message }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
