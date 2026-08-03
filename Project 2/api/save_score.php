<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$allowedModes = ["tide", "breeze", "sun"];

$player = isset($data["player"]) ? trim((string) $data["player"]) : "";
$mode   = isset($data["mode"]) ? trim((string) $data["mode"]) : "";
$moves  = isset($data["moves"]) ? (int) $data["moves"] : -1;
$time   = isset($data["time"]) ? (int) $data["time"] : -1;

if ($player === "") {
    $player = "Anonymous";
}
$player = mb_substr($player, 0, 24);

if (!in_array($mode, $allowedModes, true)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid mode"]);
    exit;
}

if ($moves <= 0 || $moves > 100000 || $time <= 0 || $time > 100000) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid moves or time"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO puzzle_scores (player, mode, moves, time_seconds) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssii", $player, $mode, $moves, $time);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}

$stmt->close();
$conn->close();
