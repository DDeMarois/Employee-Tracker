-- Insert initial data into departments table
INSERT INTO department 
    (name) 
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Human Resources');

-- Insert initial data into roles table
INSERT INTO role 
    (title, salary, department_id) 
VALUES 
('Sales Manager', 80000, 1),
('Salesperson', 50000, 1),
('Software Engineer', 90000, 2),
('Accountant', 70000, 3),
('HR Manager', 75000, 4);

-- Insert initial data into employees table
INSERT INTO employee 
    (first_name, last_name, role_id, manager_id) 
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, NULL),
('Bob', 'Brown', 4, NULL),
('Carol', 'Davis', 5, NULL);