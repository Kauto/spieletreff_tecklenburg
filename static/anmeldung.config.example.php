<?php
/**
 * Kopiere diese Datei nach anmeldung.config.php und trage Zugangsdaten ein.
 * anmeldung.config.php nicht ins Repository committen (steht in .gitignore).
 *
 * Im produktiven Betrieb wird diese Datei automatisch vom GitHub-Actions-Workflow
 * aus dem Secret RESEND_API_KEY generiert und via SFTP hochgeladen.
 *
 * Resend SMTP (https://resend.com/docs/send-with-smtp):
 * - Host: smtp.resend.com
 * - Port: 465 (SSL) oder 587 (STARTTLS)
 * - Username: resend
 * - Password: dein Resend API-Key
 */
return [
    'smtp' => [
        'host' => 'smtp.resend.com',
        'port' => 465,
        'encryption' => 'ssl',
        'username' => 'resend',
        'password' => '',
        'ssl_verify_peer' => true,
    ],
];
