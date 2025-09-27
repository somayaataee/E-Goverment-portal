-- Create database
CREATE DATABASE egov_db;

-- Users table: citizens, officers, admins
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- citizen, officer, admin
    department_id INT, -- nullable for citizens
    national_id VARCHAR(20), -- for citizens
    dob DATE, -- for citizens
    job_title VARCHAR(100), -- for officers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    services TEXT   
);


-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fee NUMERIC(10,2) DEFAULT 0,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE
);


-- Requests table: citizens apply for services
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    service_id INT REFERENCES services(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Submitted', -- Submitted, Under Review, Approved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table: files uploaded for requests
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES requests(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table: simulated payments for requests
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES requests(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Paid', -- Paid, Pending, Failed
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table: messages for users
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: initial data
INSERT INTO departments (name) VALUES
INSERT INTO departments (name, description) VALUES
('Civil Services', 'General civil service department'),
('Transport', 'Transport related services'),
('Health', 'Health related services'),
('Education', 'Education related services');

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('Officer One', 'officer1@example.com', 'officer123', 'officer'),
('Citizen One', 'citizen1@example.com', 'citizen123', 'citizen');

INSERT INTO services (name, description, fee, department_id) VALUES
('Passport Renewal', 'Renew your passport quickly', 50, 1),
('Business License', 'Apply for business license online', 120, 2),
('Property Registration', 'Register your property easily', 80, 3),
('Utility Connection', 'Request water/electricity connection', 30, 4),
('Birth Certificate', 'Request certified birth documents', 20, 5),
('Marriage Certificate', 'Apply for marriage certificate', 25, 6),
('Vehicle Registration', 'Register vehicles online', 60, 7),
('Business Permit', 'Get required permits for business', 100, 9);




