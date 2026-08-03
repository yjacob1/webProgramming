<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$allowedModes = ["tide", "breeze", "sun"];
$mode = isset($_GET["mode"]) ? trim((string) $_GET["mode"]) : "";

if (!in_array($mode, $allowedModes, true)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid mode"]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT player, moves, time_seconds FROM puzzle_scores
     WHERE mode = ? ORDER BY moves ASC, time_seconds ASC LIMIT 10"
);
$stmt->bind_param("s", $mode);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = [
        "player" => $row["player"],
        "moves" => (int) $row["moves"],
        "time_seconds" => (int) $row["time_seconds"],
    ];
}

echo json_encode($rows);

$stmt->close();
$conn->close();
