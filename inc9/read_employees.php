<?php
require "db.php";

$sql = "SELECT emp_id, emp_name, job_name, salary, hire_date, department_name FROM employees ORDER BY emp_id";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Employee Records</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body class="demo-page">
<div class="demo-shell">
  <div class="demo-card">
    <h1 class="demo-title">Employee Records</h1>
    <p class="demo-subtitle">All employees currently in the database.</p>

    <?php if ($result && $result->num_rows > 0): ?>
      <table class="demo-table">
        <tr>
          <th>ID</th><th>Name</th><th>Job</th><th>Salary</th><th>Hire Date</th><th>Department</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?php echo htmlspecialchars($row['emp_id']); ?></td>
          <td><?php echo htmlspecialchars($row['emp_name']); ?></td>
          <td><?php echo htmlspecialchars($row['job_name']); ?></td>
          <td><?php echo htmlspecialchars($row['salary']); ?></td>
          <td><?php echo htmlspecialchars($row['hire_date']); ?></td>
          <td><?php echo htmlspecialchars($row['department_name']); ?></td>
        </tr>
        <?php endwhile; ?>
      </table>
    <?php else: ?>
      <p class="demo-msg error">No records found.</p>
    <?php endif; ?>

    <div class="demo-actions">
      <a class="demo-link" href="employee_demo.php">Add Another Employee</a>
    </div>
  </div>
</div>
</body>
</html>
<?php $conn->close(); ?>
