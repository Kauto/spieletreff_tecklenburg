<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (strpos($contentType, 'application/json') !== false) {
    $decoded = json_decode(file_get_contents('php://input'), true);
    $data = is_array($decoded) ? $decoded : [];
} else {
    $data = $_POST;
}

$name      = trim(isset($data['name']) ? $data['name'] : '');
$email     = trim(isset($data['email']) ? $data['email'] : '');
$nachricht = trim(isset($data['nachricht']) ? $data['nachricht'] : '');

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

$to            = 'kauto@gmx.de';
$senderAddress = 'onboarding@resend.dev';
$subject       = 'Anmeldung Spieletreff Tecklenburger Land – ' . $name;

$body  = "Neue Anmeldung über das Webformular:\n\n";
$body .= "Name:    " . $name . "\n";
$body .= "E-Mail:  " . $safeEmail . "\n";
if (!empty($nachricht)) {
    $body .= "\nNachricht:\n" . $nachricht . "\n";
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$configPath = __DIR__ . '/anmeldung.config.php';
$config = [];
if (is_file($configPath)) {
    $loaded = include $configPath;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}

$smtpResult = null;
$sent       = false;

if (isset($config['smtp']) && is_array($config['smtp'])) {
    $smtpCfg  = $config['smtp'];
    $smtpPass = isset($smtpCfg['password']) ? $smtpCfg['password'] : '';
    if ($smtpPass !== '') {
        $smtpPhp = __DIR__ . '/anmeldung-smtp.php';
        if (is_file($smtpPhp)) {
            require_once $smtpPhp;
            $smtpResult = anmeldung_send_via_smtp($smtpCfg, $to, $senderAddress, $encodedSubject, $body);
            if (isset($smtpResult['ok']) && $smtpResult['ok']) {
                $sent = true;
            }
        } else {
            $smtpResult = ['ok' => false, 'error' => 'SMTP: Datei anmeldung-smtp.php fehlt auf dem Server.'];
        }
    } else {
        $smtpResult = ['ok' => false, 'error' => 'SMTP: Kein Passwort in anmeldung.config.php gesetzt.'];
    }
} else {
    $smtpResult = ['ok' => false, 'error' => 'SMTP: anmeldung.config.php fehlt oder enthält keinen smtp-Block.'];
}

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    $err = isset($smtpResult['error']) ? $smtpResult['error'] : 'Unbekannter SMTP-Fehler.';
    if (!empty($smtpResult['last_response'])) {
        $err .= ' | SMTP last: ' . trim($smtpResult['last_response']);
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fehler beim Senden der E-Mail.',
        'debug'   => $err,
    ]);
}
