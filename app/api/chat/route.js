import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { MongoClient } from 'mongodb'

let mongoClient, db

async function connectDB() {
  if (!db) {
    mongoClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
    await mongoClient.connect()
    db = mongoClient.db(process.env.DB_NAME || 'your_database_name')
  }
  return db
}

export const maxDuration = 30

export async function POST(request) {
  try {
    const { messages } = await request.json()
    const database = await connectDB()

    const result = streamText({
      model: openai(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
      messages,
      system: `You are Mark, a friendly and knowledgeable AI shopping assistant for Artisan Coffee Roasters.

Your role:
- Help customers discover and purchase coffee products
- Search the product catalog to find items matching their preferences
- Provide detailed product information
- Add items to their cart
- Help with price negotiations within reasonable limits
- Create shopping missions to track their goals

Guidelines:
- ALWAYS search the catalog before making product recommendations
- Be specific with product names and prices
- Ask clarifying questions when needed (roast level, price range, etc.)
- Suggest products that truly match their preferences
- Be enthusiastic but not pushy
- Use the tools available to you to help customers

When customers ask about products:
1. Use search_products to find matches
2. Present 2-3 best options with details
3. Explain why each product matches their needs
4. Offer to add items to cart or provide more info`,
      tools: {
        search_products: tool({
          description: 'Search the product catalog by name, category, or price range. Use this to find products matching customer requests.',
          parameters: z.object({
            query: z.string().optional().describe('Search query for product name or description'),
            category: z.string().optional().describe('Filter by category: Single Origin, Blends, Espresso, Decaf, Equipment'),
            max_price: z.number().optional().describe('Maximum price filter'),
            min_price: z.number().optional().describe('Minimum price filter'),
            limit: z.number().optional().default(5).describe('Maximum number of products to return')
          }),
          execute: async ({ query, category, max_price, min_price, limit }) => {
            const filter = { status: { $ne: 'deleted' } }
            
            if (query) {
              filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
              ]
            }
            
            if (category) {
              filter.category = { $regex: category, $options: 'i' }
            }
            
            if (max_price || min_price) {
              filter.price = {}
              if (max_price) filter.price.$lte = max_price
              if (min_price) filter.price.$gte = min_price
            }
            
            const products = await database.collection('products')
              .find(filter)
              .limit(limit || 5)
              .toArray()
            
            return products.map(({ _id, ...p }) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              compare_at_price: p.compare_at_price,
              category: p.category,
              image: p.image,
              weight: p.weight,
              tags: p.tags,
              bargain_enabled: p.bargain_enabled,
              bargain_min_price: p.bargain_min_price
            }))
          }
        }),
        
        get_product_details: tool({
          description: 'Get detailed information about a specific product by ID',
          parameters: z.object({
            product_id: z.string().describe('The product ID')
          }),
          execute: async ({ product_id }) => {
            const product = await database.collection('products').findOne({ id: product_id })
            if (!product) return { error: 'Product not found' }
            
            const { _id, ...details } = product
            return details
          }
        }),
        
        add_to_cart: tool({
          description: 'Add a product to the customer\'s shopping cart',
          parameters: z.object({
            product_id: z.string().describe('The product ID to add'),
            quantity: z.number().default(1).describe('Quantity to add')
          }),
          execute: async ({ product_id, quantity }) => {
            const product = await database.collection('products').findOne({ id: product_id })
            if (!product) return { success: false, message: 'Product not found' }
            
            return {
              success: true,
              message: `Added ${quantity}x ${product.name} to cart`,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
              },
              quantity
            }
          }
        }),
        
        negotiate_price: tool({
          description: 'Negotiate a product price. Only works for products with bargain_enabled=true. The minimum acceptable price is bargain_min_price.',
          parameters: z.object({
            product_id: z.string().describe('The product ID'),
            offered_price: z.number().describe('The price the customer is offering')
          }),
          execute: async ({ product_id, offered_price }) => {
            const product = await database.collection('products').findOne({ id: product_id })
            if (!product) return { success: false, message: 'Product not found' }
            
            if (!product.bargain_enabled) {
              return {
                success: false,
                message: `Sorry, ${product.name} has a fixed price of $${product.price}`
              }
            }
            
            const minPrice = product.bargain_min_price || product.price * 0.8
            
            if (offered_price >= minPrice) {
              return {
                success: true,
                message: `Deal! I can offer ${product.name} for $${offered_price}`,
                negotiated_price: offered_price,
                product_name: product.name
              }
            } else {
              return {
                success: false,
                message: `I appreciate the offer, but the lowest I can go on ${product.name} is $${minPrice.toFixed(2)}`,
                minimum_price: minPrice
              }
            }
          }
        }),
        
        create_shopping_mission: tool({
          description: 'Create a shopping mission to track the customer\'s goals and preferences',
          parameters: z.object({
            goal: z.string().describe('The customer\'s shopping goal'),
            budget: z.number().optional().describe('Maximum budget'),
            preferences: z.array(z.string()).optional().describe('Customer preferences like roast level, origin, etc.')
          }),
          execute: async ({ goal, budget, preferences }) => {
            const mission = {
              id: crypto.randomUUID(),
              goal,
              budget_max: budget,
              preferences: preferences || [],
              status: 'active',
              created_at: new Date()
            }
            
            await database.collection('missions').insertOne(mission)
            
            return {
              success: true,
              message: `Mission created! I'll help you ${goal}`,
              mission_id: mission.id
            }
          }
        })
      },
      maxSteps: 5,
      onFinish: async ({ response }) => {
        // Extract products from tool results for frontend display
        const products = []
        
        if (response.steps) {
          for (const step of response.steps) {
            if (step.toolResults) {
              for (const result of step.toolResults) {
                if (result.toolName === 'search_products' && Array.isArray(result.result)) {
                  products.push(...result.result)
                } else if (result.toolName === 'add_to_cart' && result.result.product) {
                  // Track added products
                }
              }
            }
          }
        }
        
        return { products }
      }
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
