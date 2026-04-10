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

$to      = 'ma.lampe@web.de';
$subject = 'Anmeldung Spieletreff Tecklenburger Land – ' . $name;

$body  = "Neue Anmeldung über das Webformular:\n\n";
$body .= "Name:    " . $name . "\n";
$body .= "E-Mail:  " . $safeEmail . "\n";
if (!empty($nachricht)) {
    $body .= "\nNachricht:\n" . $nachricht . "\n";
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$senderAddress = 'ma.lampe@web.de';
$headers = implode("\r\n", [
    'From: ' . $senderAddress,
    'Reply-To: ' . $senderAddress,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
]);

$configPath = __DIR__ . '/anmeldung.config.php';
$config = [];
if (is_file($configPath)) {
    $loaded = include $configPath;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}

$sent = false;
$smtpResult = null;

if (isset($config['smtp']) && is_array($config['smtp'])) {
    $smtpCfg = $config['smtp'];
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
    }
}

if (!$sent) {
    $mailWarnings = [];
    set_error_handler(function ($severity, $message, $file, $line) use (&$mailWarnings) {
        $mailWarnings[] = $message . ' in ' . basename($file) . ':' . $line;
        return true;
    });

    $mailOk = mail($to, $encodedSubject, $body, $headers, '-f' . $senderAddress);
    $firstAttemptWarnings = $mailWarnings;

    if (!$mailOk) {
        $mailWarnings = [];
        $mailOk = mail($to, $encodedSubject, $body, $headers);
    }

    $secondAttemptWarnings = $mailWarnings;
    restore_error_handler();

    if ($mailOk) {
        $sent = true;
    }
}

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    $lastError = error_get_last();
    $parts = [];

    $parts[] = 'mail() lieferte false ohne brauchbare PHP-Warnung (typisch: kein sendmail/MTA auf dem Webspace).';
    $parts[] = 'sendmail_path=' . (ini_get('sendmail_path') ? ini_get('sendmail_path') : '(leer)');

    if ($smtpResult !== null) {
        if (!empty($smtpResult['ok'])) {
            $parts[] = 'SMTP: OK (sollte nicht bei Fehler erscheinen)';
        } else {
            $err = isset($smtpResult['error']) ? $smtpResult['error'] : 'SMTP unbekannt';
            $parts[] = $err;
            if (!empty($smtpResult['last_response'])) {
                $parts[] = 'SMTP last: ' . trim($smtpResult['last_response']);
            }
        }
    } else {
        $parts[] = 'SMTP: nicht konfiguriert (optional: anmeldung.config.php mit smtp.password aus anmeldung.config.example.php).';
    }

    if (!empty($secondAttemptWarnings)) {
        $parts[] = 'PHP: ' . implode(' | ', $secondAttemptWarnings);
    } elseif (!empty($firstAttemptWarnings)) {
        $parts[] = 'PHP: ' . implode(' | ', $firstAttemptWarnings);
    } elseif (is_array($lastError) && isset($lastError['message']) && is_string($lastError['message'])) {
        $parts[] = 'PHP: ' . $lastError['message'];
    }

    $errorMessage = implode("\n", $parts);

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fehler beim Senden der E-Mail.',
        'debug' => $errorMessage
    ]);
}
