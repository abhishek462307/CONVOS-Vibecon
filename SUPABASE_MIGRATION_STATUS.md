# Supabase Database Migration - Status Report

## Issue Summary
The Kubernetes container environment cannot resolve the Supabase database hostname via DNS.

## Connection Details Provided
- **Host**: db.ynhiqtergpyamssxyrnj.supabase.co
- **Port**: 5432 (direct) / 6543 (pooler)
- **Database**: postgres
- **User**: postgres
- **Password**: zebbut-gebpyd-8sywbA
- **Supabase URL**: https://ynhiqtergpyamssxyrnj.supabase.co (HTTPS endpoint is reachable)

## Problem
```
Error: getaddrinfo ENOTFOUND db.ynhiqtergpyamssxyrnj.supabase.co
```

The database subdomain (db.*) cannot be resolved from inside the Kubernetes cluster, although the main HTTPS endpoint works fine.

## Attempted Solutions
1. ✅ Direct PostgreSQL connection on port 5432 - DNS failed
2. ✅ Connection pooler on port 6543 - DNS failed  
3. ✅ Supabase JS client with REST API - Invalid API key (service role key needed)
4. ✅ Multiple connection string formats - All DNS failed

## What Works
- HTTPS endpoint: `https://ynhiqtergpyamssxyrnj.supabase.co` is reachable (returns 401 as expected)
- Local MongoDB is working perfectly for all current features

## Possible Causes
1. **Supabase project is paused/inactive** - Please check your Supabase dashboard
2. **Network/firewall restriction** - The Kubernetes environment may have restricted DNS resolution
3. **Incorrect hostname** - The provided hostname might not be correct
4. **Service role key needed** - The password provided might be database password, not the service role key for REST API

## Required from User
To proceed with Supabase migration, please provide ONE of the following:

### Option A: Direct Connection (Preferred)
- Verify your Supabase project is **active** (not paused)
- Provide the **IPv4 address** directly (instead of hostname)
- Or provide the **Transaction Pooler** connection string from:
  - Supabase Dashboard → Settings → Database → Connection String → Transaction Mode

### Option B: REST API Approach
- Provide the **Service Role Key** from:
  - Supabase Dashboard → Settings → API → service_role (secret)

## Current Workaround
The application is fully functional using local MongoDB. All new merchant features (Orders, Shipments, Reviews, Campaigns, Store Design) have been implemented and are working with MongoDB.

## Database Schema Ready
The PostgreSQL schema is ready for migration in `/app/scripts/migrate.js`:
- Products
- Conversations
- Missions
- Intents
- Consumer Profiles
- Orders
- Reviews
- Store Config
- Approvals
- Campaigns

Once connectivity is established, migration can be completed in minutes.

## Files
- Migration script: `/app/scripts/migrate.js` (PostgreSQL direct)
- Alternative: `/app/scripts/supabase-migrate.js` (Supabase JS client)
- Connection test: `/app/scripts/test-pooler.js`

---

**Status**: BLOCKED - Awaiting Supabase connectivity resolution  
**Impact**: Low - Application fully functional with MongoDB  
**Next Step**: User to verify Supabase project status or provide alternative connection method
