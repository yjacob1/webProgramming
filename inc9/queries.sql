-- ==========================================================
-- Level 1 — Basic
-- ==========================================================

-- Salary filter + sort
SELECT emp_id, emp_name, job_name, salary
FROM employees
WHERE salary > 70000
ORDER BY salary DESC;

-- Show all employees hired in 2025
SELECT emp_name, hire_date
FROM employees
WHERE hire_date BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY hire_date ASC;

-- Show employees from two departments
SELECT emp_name, department_name, salary
FROM employees
WHERE department_name IN ('Engineering', 'Marketing')
ORDER BY department_name, salary DESC;

-- ==========================================================
-- Level 2 — Intermediate
-- ==========================================================

-- Count all rows
SELECT COUNT(*) AS total_employees FROM employees;

-- Average salary
SELECT AVG(salary) AS avg_salary FROM employees;

-- Highest and lowest salary
SELECT MAX(salary) AS highest, MIN(salary) AS lowest
FROM employees;

-- Filter by department
SELECT emp_name, salary
FROM employees
WHERE department_name = 'Engineering'
ORDER BY salary DESC;

-- Group by department with avg salary
SELECT department_name, COUNT(*) AS emp_count,
       AVG(salary) AS avg_sal
FROM employees
GROUP BY department_name;

-- Count employees by department, highest first
SELECT department_name,
       COUNT(*) AS emp_count
FROM employees
GROUP BY department_name
ORDER BY emp_count DESC;

-- Search by pattern and salary range
SELECT emp_name, job_name, salary
FROM employees
WHERE job_name LIKE '%er%'
  AND salary BETWEEN 70000 AND 95000
ORDER BY salary DESC;

-- ==========================================================
-- Level 3 — Advanced
-- ==========================================================

-- Departments with avg salary above 70000
SELECT department_name,
       COUNT(*) AS emp_count,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department_name
HAVING AVG(salary) > 70000
ORDER BY avg_salary DESC;

-- Salary band classification using CASE
SELECT emp_name,
       salary,
       CASE
         WHEN salary >= 85000 THEN 'High'
         WHEN salary >= 70000 THEN 'Medium'
         ELSE 'Standard'
       END AS salary_band
FROM employees
ORDER BY salary DESC;

-- Employees earning above overall average (subquery)
SELECT emp_name, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
)
ORDER BY salary DESC;
