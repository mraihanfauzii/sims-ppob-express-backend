-- File Desain Database (DDL) untuk SIMS PPOB

-- Menghapus tabel jika sudah ada
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS users;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    balance BIGINT DEFAULT 0,
    profile_image VARCHAR(255) DEFAULT 'https://yoururlapi.com/profile.jpeg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger untuk otomatis update 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabel Banners
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
);

-- Tabel Services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff INT NOT NULL
);

-- Tabel Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'TOPUP' atau 'PAYMENT'
    description TEXT,
    total_amount BIGINT NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- === SEED DATA (Data Awal) ===

-- Seed Data untuk Banners (Sesuai Kontrak API)
INSERT INTO banners (banner_name, banner_image, description)
VALUES
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Seed Data untuk Services (Sesuai Kontrak API)
INSERT INTO services (service_code, service_name, service_icon, service_tariff)
VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('MUSIK', 'Music', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAKET', 'Paket Data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('E-MONEY', 'E-Money', 'https://nutech-integrasi.app/dummy.jpg', 150000);