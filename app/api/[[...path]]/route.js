import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client, db
async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME || 'convos')
  }
  return db
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
// DEMO PRODUCTS
// ═══════════════════════════════════════════
const DEMO_PRODUCTS = [
  {
    id: uuidv4(), name: 'Wireless Pro Headphones', description: 'Premium noise-cancelling wireless headphones with 40hr battery life, Hi-Res audio, and adaptive sound control.',
    price: 89.99, compare_at_price: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 45, bargain_enabled: true, bargain_min_price: 69.99, tags: ['headphones', 'wireless', 'audio', 'gift']
  },
  {
    id: uuidv4(), name: 'Titanium Smartwatch', description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Titanium case with sapphire display.',
    price: 199.99, compare_at_price: 279.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 30, bargain_enabled: true, bargain_min_price: 159.99, tags: ['watch', 'smart', 'fitness', 'gift']
  },
  {
    id: uuidv4(), name: 'Portable Bluetooth Speaker', description: 'Waterproof 360° sound speaker with deep bass. Perfect for outdoors with 12hr playtime.',
    price: 49.99, compare_at_price: 69.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 60, bargain_enabled: true, bargain_min_price: 39.99, tags: ['speaker', 'bluetooth', 'portable', 'gift']
  },
  {
    id: uuidv4(), name: 'Performance Running Sneakers', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Carbon fiber plate.',
    price: 129.99, compare_at_price: 169.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    stock: 25, bargain_enabled: true, bargain_min_price: 99.99, tags: ['shoes', 'running', 'sneakers', 'fitness']
  },
  {
    id: uuidv4(), name: 'Heritage Leather Backpack', description: 'Full-grain leather backpack with laptop sleeve, RFID protection, and organizer pockets.',
    price: 79.99, compare_at_price: 119.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    stock: 35, bargain_enabled: true, bargain_min_price: 59.99, tags: ['backpack', 'leather', 'travel', 'gift']
  },
  {
    id: uuidv4(), name: 'Designer Sunglasses', description: 'Polarized UV400 sunglasses with acetate frame. Classic aviator design meets modern engineering.',
    price: 64.99, compare_at_price: 89.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    stock: 40, bargain_enabled: true, bargain_min_price: 49.99, tags: ['sunglasses', 'fashion', 'accessories', 'gift']
  },
  {
    id: uuidv4(), name: 'Artisan Candle Collection', description: 'Hand-poured soy candle set with 3 signature scents. Burns clean for 45+ hours each.',
    price: 34.99, compare_at_price: 49.99, category: 'Home', image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop',
    stock: 55, bargain_enabled: true, bargain_min_price: 24.99, tags: ['candles', 'home', 'gift', 'decor']
  },
  {
    id: uuidv4(), name: 'Premium Coffee Maker', description: 'Precision brew coffee maker with built-in grinder, temperature control, and programmable timer.',
    price: 149.99, compare_at_price: 199.99, category: 'Home', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
    stock: 20, bargain_enabled: true, bargain_min_price: 119.99, tags: ['coffee', 'kitchen', 'appliance']
  },
  {
    id: uuidv4(), name: 'Minimalist Jewelry Box', description: 'Elegant walnut wood jewelry organizer with velvet interior and mirror. Perfect gift.',
    price: 44.99, compare_at_price: 64.99, category: 'Gifts', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6e5?w=400&h=400&fit=crop',
    stock: 40, bargain_enabled: true, bargain_min_price: 34.99, tags: ['jewelry', 'gift', 'organizer', 'wood']
  },
  {
    id: uuidv4(), name: 'Cashmere Throw Blanket', description: 'Luxuriously soft 100% cashmere throw. Lightweight warmth in timeless herringbone pattern.',
    price: 99.99, compare_at_price: 149.99, category: 'Home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    stock: 15, bargain_enabled: true, bargain_min_price: 79.99, tags: ['blanket', 'cashmere', 'home', 'gift', 'luxury']
  }
]

// ═══════════════════════════════════════════
// AI CONFIGURATION
// ═══════════════════════════════════════════
const SYSTEM_PROMPT = `You are Convos, a sophisticated AI commerce agent for an agentic shopping platform. You help buyers find exactly what they need through intelligent conversation.

CAPABILITIES:
- Search and recommend products from the catalog
- Create persistent shopping missions for buyer goals
- Negotiate prices within merchant-approved boundaries
- Add items to cart and guide toward checkout
- Provide personalized recommendations

PERSONALITY:
- Commercially intelligent but never pushy
- Warm, professional, proactive
- Transparent about pricing and savings
- Goal-oriented — naturally guide toward conversion

RULES:
1. ALWAYS use search_products before recommending anything
2. When a buyer describes a goal, use create_mission to track it
3. For negotiations, respect the bargain_min_price boundary
4. Only recommend products from search results
5. When buyer seems ready, offer to generate checkout
6. Keep responses concise (2-4 sentences unless detail is needed)
7. Mention specific prices and savings when relevant
8. Be enthusiastic about good deals

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

  // Ensure all tool_calls have type: 'function'
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
  // Chat Completions format
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
  // Responses API format (fallback)
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
      const products = await db.collection('products').find(filter).limit(6).toArray()
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

    // ─── Products ───
    if (route === '/products' && method === 'GET') {
      const products = await db.collection('products').find({ status: { $ne: 'deleted' } }).toArray()
      return corsResponse(products.map(({ _id, ...p }) => p))
    }

    if (route === '/products/seed' && method === 'POST') {
      const existing = await db.collection('products').countDocuments()
      if (existing >= 8) return corsResponse({ message: 'Products already seeded', count: existing })
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

      // Get or create conversation
      let conv = await db.collection('conversations').findOne({ session_id })
      if (!conv) {
        conv = { id: uuidv4(), session_id, messages: [], cart: [], created_at: new Date(), updated_at: new Date() }
        await db.collection('conversations').insertOne(conv)
      }

      // Ensure consumer profile exists
      await updateConsumerProfile(db, session_id, { action: 'message' })

      // Add user message
      conv.messages.push({ role: 'user', content: message, timestamp: new Date() })
      await logIntent(db, session_id, 'message', `Buyer: "${message.substring(0, 100)}"`, {})

      // Build messages for AI
      const aiMessages = [{ role: 'system', content: SYSTEM_PROMPT }]
      // Keep last 20 messages for context
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

      // Tool-calling loop
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
          // Store assistant message with tool calls
          const assistantMsg = { role: 'assistant', content: parsed.partial_text || null, tool_calls: parsed.tool_calls, timestamp: new Date() }
          conv.messages.push(assistantMsg)
          aiMessages.push({ role: 'assistant', content: parsed.partial_text || null, tool_calls: parsed.tool_calls })

          // Execute each tool
          for (const tc of parsed.tool_calls) {
            const toolResult = await executeTool(tc.function.name, tc.function.arguments, db, session_id)
            conv.messages.push({ role: 'tool', tool_call_id: tc.id, content: toolResult, timestamp: new Date() })
            aiMessages.push({ role: 'tool', tool_call_id: tc.id, content: toolResult })

            // Extract structured data for frontend
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

      // Get updated cart
      const updatedConv = await db.collection('conversations').findOne({ session_id })
      const currentCart = updatedConv?.cart || conv.cart || []

      // Save conversation
      await db.collection('conversations').updateOne(
        { session_id },
        { $set: { messages: conv.messages, updated_at: new Date() } }
      )

      // Get active missions for this session
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
      const { session_id } = body
      const conv = await db.collection('conversations').findOne({ session_id })
      const cart = conv?.cart || []
      if (cart.length === 0) return corsResponse({ error: 'Cart is empty' }, 400)
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
          metadata: { convos_session_id: session_id }
        })
        return corsResponse({ url: session.url, session_id: session.id })
      } catch(e) {
        console.error('Stripe error:', e)
        return corsResponse({ error: 'Checkout unavailable' }, 500)
      }
    }

    // ─── Approvals (Merchant) ───
    if (route === '/approvals' && method === 'GET') {
      const approvals = await db.collection('approvals').find({ status: 'pending' }).sort({ created_at: -1 }).toArray()
      return corsResponse(approvals.map(({ _id, ...a }) => a))
    }

    // ─── Stats (Merchant) ───
    if (route === '/stats' && method === 'GET') {
      const totalProducts = await db.collection('products').countDocuments({ status: { $ne: 'deleted' } })
      const totalConversations = await db.collection('conversations').countDocuments()
      const totalMissions = await db.collection('missions').countDocuments()
      const activeMissions = await db.collection('missions').countDocuments({ status: 'active' })
      const totalIntents = await db.collection('intents').countDocuments()
      const recentIntents = await db.collection('intents').countDocuments({ timestamp: { $gt: new Date(Date.now() - 3600000) } })
      const profiles = await db.collection('consumer_profiles').find({}).toArray()
      const avgTrust = profiles.length ? (profiles.reduce((s, p) => s + (p.trust_score || 80), 0) / profiles.length).toFixed(1) : 80
      return corsResponse({ totalProducts, totalConversations, totalMissions, activeMissions, totalIntents, recentIntents, avgTrustScore: parseFloat(avgTrust), totalBuyers: profiles.length })
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
