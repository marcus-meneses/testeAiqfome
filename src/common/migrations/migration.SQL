-- Optional: create the database if it doesn't exist
-- CREATE DATABASE postgre;
-- \c postgre

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS "UserProducts";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "User";

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Product table
CREATE TABLE "Product" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fakestore_id BIGINT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT,
    price MONEY NOT NULL,
    review DECIMAL(4,2) CHECK (review IS NULL OR (review >= 0.00 AND review <= 10.00))
);

-- UserProducts (many-to-many join table)
CREATE TABLE "UserProducts" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);
