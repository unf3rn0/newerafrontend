-- Remove legacy marketplace/provider tables. NewEra uses only manual QR payment
-- stored as order paymentStatus, with no external payment provider records.
DROP TABLE IF EXISTS "alif_provider_transactions" CASCADE;
DROP TABLE IF EXISTS "payment_methods" CASCADE;
DROP TABLE IF EXISTS "discounts" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
