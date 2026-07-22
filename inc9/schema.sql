CREATE TABLE IF NOT EXISTS employees (
  emp_id          INT AUTO_INCREMENT PRIMARY KEY,
  emp_name        VARCHAR(100) NOT NULL,
  job_name        VARCHAR(100) NOT NULL,
  salary          DECIMAL(10,2) NOT NULL,
  hire_date       DATE NOT NULL,
  department_id   INT NOT NULL,
  department_name VARCHAR(100) NOT NULL
);

INSERT INTO employees
  (emp_name, job_name, salary, hire_date, department_id, department_name)
VALUES
  ('Ana Lopez',   'Developer', 73000.00, '2025-09-15', 1, 'Engineering'),
  ('David Kim',   'Analyst',   68000.00, '2025-11-01', 2, 'Finance'),
  ('Sara Cole',   'Designer',  71000.00, '2026-01-08', 3, 'Marketing'),
  ('James Reed',  'Manager',   90000.00, '2024-06-20', 1, 'Engineering');
