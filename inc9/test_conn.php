<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "db.php";

echo "Connection successful";
echo " | Server: " . $conn->server_info;
$conn->close();
