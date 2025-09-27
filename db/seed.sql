-- Departments
INSERT INTO departments(name) VALUES ('Interior'),('Commerce'),('Housing');

-- Services (include fee)
INSERT INTO services(name, department_id, fee) VALUES
('Passport Renewal', 1, 50),
('National ID Update', 1, 0),
('Business License', 2, 100),
('Land Registration', 3, 0);

-- Admin
INSERT INTO users(name, email, password, role)
VALUES ('Admin One', 'admin@gov.local', '$2a$10$W7VbQJz1vZJg0c.tJ2l9UOVmONvA1QyXgJwZcZzZq4GqjJm0z7c6i', 'admin');
-- رمز: 123456

-- Officer (Interior)
INSERT INTO users(name, email, password, role, department_id)
VALUES ('Officer A', 'officer@gov.local', '$2a$10$W7VbQJz1vZJg0c.tJ2l9UOVmONvA1QyXgJwZcZzZq4GqjJm0z7c6i', 'officer', 1);
-- رمز: 123456
