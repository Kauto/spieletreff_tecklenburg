<?php
/**
 * Kopiere diese Datei nach anmeldung.config.php und trage Zugangsdaten ein.
 * anmeldung.config.php nicht ins Repository committen (steht in .gitignore).
 *
 * web.de SMTP (typisch):
 * - Host: smtp.web.de
 * - Port: 465 mit SSL oder 587 mit STARTTLS
 */
return [
    'smtp' => [
        'host' => 'smtp.web.de',
        'port' => 465,
        // 'ssl' = direkte SSL-Verbindung (Port 465), 'tls' = STARTTLS (Port 587)
        'encryption' => 'ssl',
        'username' => 'ma.lampe@web.de',
        'password' => '',
        // Bei Zertifikatsproblemen auf dem Server ggf. auf false setzen (unsicherer)
        'ssl_verify_peer' => true,
    ],
];
