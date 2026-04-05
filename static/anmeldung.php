<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType, 'application/json')) {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
} else {
    $data = $_POST;
}

$name      = trim($data['name'] ?? '');
$email     = trim($data['email'] ?? '');
$nachricht = trim($data['nachricht'] ?? '');

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name und E-Mail sind erforderlich']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige E-Mail-Adresse']);
    exit;
}

$name      = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = filter_var($email, FILTER_SANITIZE_EMAIL);
$nachricht = htmlspecialchars($nachricht, ENT_QUOTES, 'UTF-8');

$to      = 'kauto@gmx.de';
$subject = 'Anmeldung Spieletreff Tecklenburger Land – ' . $name;

$body  = "Neue Anmeldung über das Webformular:\n\n";
$body .= "Name:    " . $name . "\n";
$body .= "E-Mail:  " . $safeEmail . "\n";
if (!empty($nachricht)) {
    $body .= "\nNachricht:\n" . $nachricht . "\n";
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = implode("\r\n", [
    'From: Spieletreff Tecklenburg <noreply@spieletreff-tecklenburg.de>',
    'Reply-To: ' . $name . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
]);

$sent = mail($to, $encodedSubject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Senden der E-Mail. Bitte versuche es später erneut.']);
}
