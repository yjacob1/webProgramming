<?php
require "db.php";

$message = "";
$messageType = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name   = trim($_POST['emp_name'] ?? '');
    $job    = trim($_POST['job_name'] ?? '');
    $salary = $_POST['salary'] ?? '';
    $hire   = $_POST['hire_date'] ?? '';
    $deptId = $_POST['department_id'] ?? '';
    $dept   = trim($_POST['department_name'] ?? '');

    if ($name === '' || $job === '' || $salary === '' || $hire === '' || $deptId === '' || $dept === '') {
        $message = "All fields are required.";
        $messageType = "error";
    } else {
        $stmt = $conn->prepare(
            "INSERT INTO employees
             (emp_name, job_name, salary, hire_date, department_id, department_name)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $salaryVal = (float) $salary;
        $deptIdVal = (int) $deptId;
        $stmt->bind_param("ssdsis", $name, $job, $salaryVal, $hire, $deptIdVal, $dept);

        if ($stmt->execute()) {
            $message = "Success! Inserted employee with ID " . $stmt->insert_id;
            $messageType = "success";
        } else {
            $message = "Error: " . $stmt->error;
            $messageType = "error";
        }
        $stmt->close();
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Add Employee</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body class="demo-page">
<div class="demo-shell">
  <div class="demo-card">
    <h1 class="demo-title">Add Employee</h1>
    <p class="demo-subtitle">Insert a new employee record into the database.</p>

    <?php if ($message): ?>
      <div class="demo-msg <?php echo htmlspecialchars($messageType); ?>">
        <?php echo htmlspecialchars($message); ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="employee_demo.php">
      <div class="demo-grid">
        <div class="demo-field">
          <label for="emp_name">Name</label>
          <input class="demo-input" type="text" id="emp_name" name="emp_name" required>
        </div>
        <div class="demo-field">
          <label for="job_name">Job Title</label>
          <input class="demo-input" type="text" id="job_name" name="job_name" required>
        </div>
        <div class="demo-field">
          <label for="salary">Salary</label>
          <input class="demo-input" type="number" step="0.01" id="salary" name="salary" required>
        </div>
        <div class="demo-field">
          <label for="hire_date">Hire Date</label>
          <input class="demo-input" type="date" id="hire_date" name="hire_date" required>
        </div>
        <div class="demo-field">
          <label for="department_id">Department ID</label>
          <input class="demo-input" type="number" id="department_id" name="department_id" required>
        </div>
        <div class="demo-field">
          <label for="department_name">Department Name</label>
          <input class="demo-input" type="text" id="department_name" name="department_name" required>
        </div>
      </div>
      <div class="demo-actions">
        <button class="demo-btn" type="submit">Add Employee</button>
        <a class="demo-link" href="read_employees.php">View All Employees</a>
      </div>
    </form>
  </div>
</div>
</body>
</html>
