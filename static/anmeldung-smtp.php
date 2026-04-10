<?php
/**
 * Minimaler SMTP-Versand für PHP 7.0+ (ohne Composer).
 * Nur für anmeldung.php gedacht.
 */

if (!function_exists('anmeldung_send_via_smtp')) {
    function anmeldung_smtp_read($socket)
    {
        $response = '';
        while ($line = @fgets($socket, 515)) {
            $response .= $line;
            if (strlen($line) < 4) {
                break;
            }
            if ($line[3] === ' ') {
                break;
            }
        }
        return $response;
    }

    function anmeldung_smtp_send_line($socket, $line)
    {
        return @fwrite($socket, $line . "\r\n") !== false;
    }

    function anmeldung_smtp_code($response)
    {
        if (strlen($response) < 3) {
            return '';
        }
        return substr($response, 0, 3);
    }

    /**
     * @param array $smtpConfig
     * @param string $to
     * @param string $fromEmail
     * @param string $encodedSubject
     * @param string $plainBody
     * @return array { ok: bool, error?: string, last_response?: string }
     */
    function anmeldung_send_via_smtp($smtpConfig, $to, $fromEmail, $encodedSubject, $plainBody)
    {
        $host = isset($smtpConfig['host']) ? $smtpConfig['host'] : '';
        $port = isset($smtpConfig['port']) ? (int) $smtpConfig['port'] : 465;
        $enc = isset($smtpConfig['encryption']) ? strtolower($smtpConfig['encryption']) : 'ssl';
        $user = isset($smtpConfig['username']) ? $smtpConfig['username'] : '';
        $pass = isset($smtpConfig['password']) ? $smtpConfig['password'] : '';
        $verifyPeer = !isset($smtpConfig['ssl_verify_peer']) || $smtpConfig['ssl_verify_peer'];

        if ($host === '' || $user === '' || $pass === '') {
            return ['ok' => false, 'error' => 'SMTP: Konfiguration unvollständig (host/username/password).'];
        }

        $socket = null;
        $lastResponse = '';

        if ($enc === 'tls' && $port === 587) {
            $socket = @stream_socket_client(
                'tcp://' . $host . ':' . $port,
                $errno,
                $errstr,
                30,
                STREAM_CLIENT_CONNECT
            );
            if (!$socket) {
                return ['ok' => false, 'error' => 'SMTP: Verbindung fehlgeschlagen: ' . $errstr . ' (' . $errno . ')'];
            }
            $lastResponse = anmeldung_smtp_read($socket);
            if (anmeldung_smtp_code($lastResponse) !== '220') {
                fclose($socket);
                return ['ok' => false, 'error' => 'SMTP: Unerwartete Antwort (220): ' . trim($lastResponse), 'last_response' => $lastResponse];
            }
            anmeldung_smtp_send_line($socket, 'EHLO localhost');
            $lastResponse = anmeldung_smtp_read($socket);
            anmeldung_smtp_send_line($socket, 'STARTTLS');
            $lastResponse = anmeldung_smtp_read($socket);
            if (anmeldung_smtp_code($lastResponse) !== '220') {
                fclose($socket);
                return ['ok' => false, 'error' => 'SMTP: STARTTLS fehlgeschlagen: ' . trim($lastResponse), 'last_response' => $lastResponse];
            }
            $cryptoOk = @stream_socket_enable_crypto(
                $socket,
                true,
                STREAM_CRYPTO_METHOD_TLS_CLIENT
            );
            if (!$cryptoOk) {
                fclose($socket);
                return ['ok' => false, 'error' => 'SMTP: TLS-Handshake fehlgeschlagen.'];
            }
            anmeldung_smtp_send_line($socket, 'EHLO localhost');
            $lastResponse = anmeldung_smtp_read($socket);
        } else {
            $ctx = stream_context_create([
                'ssl' => [
                    'verify_peer' => $verifyPeer,
                    'verify_peer_name' => $verifyPeer,
                ],
            ]);
            $socket = @stream_socket_client(
                'ssl://' . $host . ':' . $port,
                $errno,
                $errstr,
                30,
                STREAM_CLIENT_CONNECT,
                $ctx
            );
            if (!$socket) {
                return ['ok' => false, 'error' => 'SMTP: SSL-Verbindung fehlgeschlagen: ' . $errstr . ' (' . $errno . ')'];
            }
            $lastResponse = anmeldung_smtp_read($socket);
            if (anmeldung_smtp_code($lastResponse) !== '220') {
                fclose($socket);
                return ['ok' => false, 'error' => 'SMTP: Unerwartete Antwort (220): ' . trim($lastResponse), 'last_response' => $lastResponse];
            }
            anmeldung_smtp_send_line($socket, 'EHLO localhost');
            $lastResponse = anmeldung_smtp_read($socket);
        }

        anmeldung_smtp_send_line($socket, 'AUTH LOGIN');
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '334') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: AUTH LOGIN nicht erwartet: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, base64_encode($user));
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '334') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: Benutzername abgelehnt: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, base64_encode($pass));
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '235') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: Anmeldung fehlgeschlagen (Passwort oder Zugang).', 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, 'MAIL FROM:<' . $fromEmail . '>');
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '250') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: MAIL FROM fehlgeschlagen: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, 'RCPT TO:<' . $to . '>');
        $lastResponse = anmeldung_smtp_read($socket);
        $rcptCode = anmeldung_smtp_code($lastResponse);
        if ($rcptCode !== '250' && $rcptCode !== '251') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: RCPT TO fehlgeschlagen: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, 'DATA');
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '354') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: DATA nicht erlaubt: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        $headers = [
            'From: ' . $fromEmail,
            'Reply-To: ' . $fromEmail,
            'To: ' . $to,
            'Subject: ' . $encodedSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];

        $dataBody = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\r\n", "\n", $plainBody);
        $dataBody = str_replace("\n", "\r\n", $dataBody);
        $dataBody = preg_replace('/^\./m', '..', $dataBody);

        fwrite($socket, $dataBody . "\r\n.\r\n");
        $lastResponse = anmeldung_smtp_read($socket);
        if (anmeldung_smtp_code($lastResponse) !== '250') {
            fclose($socket);
            return ['ok' => false, 'error' => 'SMTP: Nachricht nicht angenommen: ' . trim($lastResponse), 'last_response' => $lastResponse];
        }

        anmeldung_smtp_send_line($socket, 'QUIT');
        anmeldung_smtp_read($socket);
        fclose($socket);

        return ['ok' => true];
    }
}
