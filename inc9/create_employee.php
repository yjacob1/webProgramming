<?php
require "db.php";

// Values to insert (hardcoded for testing)
$name   = "Sara Cole";
$job    = "Designer";
$salary = 71000.00;
$hire   = "2026-01-08";
$deptId = 3;
$dept   = "Marketing";

$stmt = $conn->prepare(
    "INSERT INTO employees
     (emp_name, job_name, salary, hire_date, department_id, department_name)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssdsis", $name, $job, $salary, $hire, $deptId, $dept);

if ($stmt->execute()) {
    echo "Success! Inserted ID: " . $stmt->insert_id;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
