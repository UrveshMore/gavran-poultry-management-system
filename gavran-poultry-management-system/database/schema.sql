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

-- Incubators table
CREATE TABLE incubators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    status ENUM('active', 'idle', 'maintenance') NOT NULL DEFAULT 'idle',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Incubation batches table
CREATE TABLE incubation_batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_no VARCHAR(50) NOT NULL UNIQUE,
    incubator_id INT NOT NULL,
    eggs_loaded INT NOT NULL,
    source_shed_id INT,
    source_batch_id INT,
    start_date DATE NOT NULL,
    expected_hatch_date DATE NOT NULL,
    status ENUM('pending', 'incubating', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incubator_id) REFERENCES incubators(id) ON DELETE CASCADE,
    FOREIGN KEY (source_shed_id) REFERENCES sheds(id),
    FOREIGN KEY (source_batch_id) REFERENCES incubation_batches(id)
);

-- Candling records table
CREATE TABLE candling_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incubation_batch_id INT NOT NULL,
    day_no INT NOT NULL,
    fertile INT DEFAULT 0,
    infertile INT DEFAULT 0,
    dead INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incubation_batch_id) REFERENCES incubation_batches(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_farms_owner ON farms(owner_id);
CREATE INDEX idx_sheds_farm ON sheds(farm_id);
CREATE INDEX idx_sheds_status ON sheds(status);
CREATE INDEX idx_incubators_farm ON incubators(farm_id);
CREATE INDEX idx_incubators_status ON incubators(status);
CREATE INDEX idx_incubation_batches_incubator ON incubation_batches(incubator_id);
CREATE INDEX idx_incubation_batches_status ON incubation_batches(status);
CREATE INDEX idx_candling_records_batch ON candling_records(incubation_batch_id);