-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'manager', 'worker', 'family') NOT NULL DEFAULT 'worker',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms table
CREATE TABLE farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sheds table
CREATE TABLE sheds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    type ENUM('broiler', 'layer', 'breeding') NOT NULL DEFAULT 'broiler',
    status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_farms_owner ON farms(owner_id);
CREATE INDEX idx_sheds_farm ON sheds(farm_id);
CREATE INDEX idx_sheds_status ON sheds(status);