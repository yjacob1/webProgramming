<?php
require "db.php";

// Row to delete (hardcoded for testing — change emp_id to a real row)
$empId = 5;

$stmt = $conn->prepare("DELETE FROM employees WHERE emp_id = ?");
$stmt->bind_param("i", $empId);

if ($stmt->execute()) {
    echo "Success! Rows deleted: " . $stmt->affected_rows;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
