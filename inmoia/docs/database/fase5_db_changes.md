# Fase 5 DB changes (Chatbot WhatsApp)

This document summarizes the database changes required by the current Fase 5 implementation.

## Why this is needed

Current backend code uses:
- Twilio webhook persistence for leads and conversations
- Chatbot conversation API (summary + thread)
- Bot configuration API (GET/PUT)
- Embedding-ready schema for semantic matching

In your current Supabase project, `agencies` is minimal and does not include bot config columns yet.

## Script to run

Run this SQL file in Supabase SQL Editor:
- [docs/database/fase5_migration.sql](docs/database/fase5_migration.sql)

## What the script changes

1. Enables required extensions:
- `pgcrypto`
- `vector`

2. Adds bot config columns to `agencies` if missing:
- `bot_name`
- `bot_greeting_es`
- `bot_greeting_en`
- `bot_active_24h`
- `bot_context`

3. Creates fallback table `chatbot_configs`:
- Used by API when `agencies` bot columns are absent.

4. Creates/aligns tables used by chatbot flow:
- `leads`
- `conversations`
- `properties` (with `embedding vector(1536)`)

5. Creates RPC function `match_properties(...)`:
- Performs semantic retrieval by cosine similarity on `properties.embedding`.
- Used by chatbot backend to retrieve top property matches per agency.

6. Adds useful indexes for query speed.

7. Adds `conversations` to realtime publication when available.

8. Enables RLS on chatbot-related tables.

## Related code already implemented

- [src/app/api/chatbot/configuracion/route.ts](src/app/api/chatbot/configuracion/route.ts)
- [src/app/(dashboard)/chatbot/configuracion/page.tsx](src/app/(dashboard)/chatbot/configuracion/page.tsx)
- [src/app/api/webhook/twilio/route.ts](src/app/api/webhook/twilio/route.ts)
- [src/lib/whatsapp/persistence.ts](src/lib/whatsapp/persistence.ts)

## Validation after running SQL

1. Open chatbot settings and save changes.
2. Confirm GET endpoint returns `persisted: true` and storage source.
3. Send a WhatsApp message and confirm:
- response in WhatsApp
- rows in `conversations`
- row upsert in `leads`

## Notes

- Script is idempotent and can be re-run safely.
- If your production schema is stricter, split this into controlled migrations per environment.
