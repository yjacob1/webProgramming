<?php
require "db.php";

// Values to update (hardcoded for testing — change emp_id to a real row)
$empId     = 1;
$newSalary = 75000.00;

$stmt = $conn->prepare("UPDATE employees SET salary = ? WHERE emp_id = ?");
$stmt->bind_param("di", $newSalary, $empId);

if ($stmt->execute()) {
    echo "Success! Rows updated: " . $stmt->affected_rows;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
