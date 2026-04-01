-- PostgreSQL Schema for PYROCRAFT

-- Create Database
-- CREATE DATABASE pyrocraft;

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    emoji VARCHAR(10),
    image_url VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    description TEXT,
    badge VARCHAR(20),
    stock INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    special_instructions TEXT,
    whatsapp_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Tracking Table
CREATE TABLE order_tracking (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);

-- Site Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) DEFAULT 'PYROCRAFT',
    marquee_text TEXT DEFAULT 'Free Shipping Above ₹2000 ✦ Premium Quality ✦ Festival Ready ✦ Handcrafted Excellence ✦ Safe & Certified',
    contact_email VARCHAR(255) DEFAULT 'support@pyrocraft.in',
    contact_phone VARCHAR(20) DEFAULT '+919876543210',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Settings Seed
INSERT INTO settings (company_name, marquee_text) VALUES ('PYROCRAFT', 'Free Shipping Above ₹2000 ✦ Premium Quality ✦ Festival Ready ✦ Handcrafted Excellence ✦ Safe & Certified');

-- Seed Sample Products
INSERT INTO products (name, category, emoji, price, original_price, description, badge, stock) VALUES
('Golden Cascade', 'aerial', '🎆', 1299, 1599, 'Spectacular aerial burst in cascading gold showers. Burns 45 seconds.', 'bestseller', 50),
('Crimson Dragon', 'aerial', '🎇', 999, NULL, 'Brilliant red aerial display with twin-tail ascent. Premium grade.', 'new', 30),
('Silver Rain', 'aerial', '✨', 1499, 1999, 'Long-lasting silver fountain reaching 80ft. Breathtaking finale.', 'sale', 25),
('Lotus Bloom', 'ground', '🌸', 599, NULL, 'Elegant ground spinner that unfolds like a golden lotus flower.', NULL, 40),
('Thunder Chakra', 'ground', '🌀', 449, 599, 'Traditional chakra with a premium gold-and-green colour palette.', 'sale', 35),
('Diamond Sparkler', 'sparkler', '💎', 349, NULL, 'Long-burn diamond-tipped sparklers. Pack of 10. 4-minute burn.', NULL, 100),
('Rainbow Wand', 'sparkler', '🌈', 499, NULL, 'Multi-colour sparkler with transitioning hues. Children''s favourite.', 'new', 60),
('Prestige Gift Box', 'gift', '🎁', 3999, 4999, 'Curated collection of 12 premium crackers in a keepsake box.', 'bestseller', 20),
('Celebration Suite', 'gift', '🏆', 5999, NULL, 'The ultimate luxury set: 25 handpicked premium crackers.', NULL, 15),
('Phoenix Rising', 'aerial', '🔥', 1799, NULL, 'Dramatic phoenix-spread aerial burst — the crown jewel of our range.', 'new', 18),
('Emerald Fountain', 'ground', '💚', 699, 899, 'Rich emerald-green ground fountain with 3-minute burn time.', 'sale', 28),
('Gold Butterfly', 'sparkler', '🦋', 279, NULL, 'Butterfly-shaped sparkler with trailing gold stars. Pack of 6.', NULL, 80);
