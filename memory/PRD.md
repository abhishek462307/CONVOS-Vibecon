# Convos - Agentic Commerce Platform PRD

## Overview
Convos is an agentic commerce platform where buyers delegate shopping goals to AI agents, and merchants supervise these live missions through a command center dashboard.

## Architecture
- **Frontend**: Next.js 14 App Router + Tailwind CSS + Shadcn UI
- **Backend**: Next.js API Routes (monolithic at `/api/[[...path]]/route.js`)
- **Database**: MongoDB (local)
- **AI**: Azure OpenAI (gpt-5.4-nano) with tool calling
- **Payments**: Stripe

## Key Routes
- `/` - Buyer Storefront (AI Chat Widget)
- `/store` - Store page
- `/product/[id]` - Product detail
- `/checkout` - Checkout flow
- `/login` - Customer authentication
- `/merchant/login` - Merchant authentication
- `/merchant` - Merchant Dashboard (9 sections)

## Merchant Dashboard (Fully Functional)
1. **Home** - Revenue, orders, products, customers stats + recent orders + live activity
2. **Intent Stream** - Real-time customer activity with color-coded types
3. **Orders** - Full CRUD, search/filter, status updates, order detail modal, export CSV
4. **Catalog** - Full CRUD, add/edit/delete products with modals, search, export
5. **Customers** - Consumer profiles with trust scores, risk levels, spending data
6. **Shipments** - Tracking numbers, carriers, status updates via modal
7. **Reviews** - Moderation (approve/reject), merchant replies, filter by status, delete
8. **Campaigns** - Full CRUD, create/edit/delete campaigns with content management
9. **Store Design** - Store info, AI assistant config, appearance settings

## API Endpoints
### Products
- `GET /api/products` - List all non-deleted products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product

### Orders
- `GET /api/orders` - List orders (supports ?status=, ?search= params)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Reviews
- `GET /api/reviews` - List reviews (supports ?status= param)
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review status/reply
- `DELETE /api/reviews/:id` - Delete review

### Campaigns
- `GET /api/campaigns` - List campaigns (supports ?status= param)
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Shipments
- `GET /api/shipments` - List active shipments
- `PUT /api/shipments/:id` - Update tracking info

### Other
- `GET /api/stats` - Dashboard statistics
- `GET/PUT /api/store-config` - Store configuration
- `GET /api/intents` - Intent stream
- `GET /api/consumer-matrix` - Customer profiles
- `POST /api/ai/chat` - AI chat with tool calling
- `POST /api/auth/login` - Authentication
- `GET /api/export/orders|products|customers` - CSV exports

## Credentials
- Customer: customer@demo.com / password123
- Merchant: merchant@demo.com / merchant123
