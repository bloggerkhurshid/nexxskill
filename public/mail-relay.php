<?php
/**
 * NexxSkill Secure Mail Relay Bridge (GoDaddy Apache / PHP)
 * Enables Node.js API (hosted on Airo) to send emails via GoDaddy's unblocked network
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Relay-Secret');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// 1. Authorization Verification
$expectedSecret = getenv('MAIL_RELAY_SECRET') ?: 'nexxskill_relay_secret_key_2026';
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_RELAY_SECRET'] ?? '';
$providedSecret = '';

if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $providedSecret = trim($matches[1]);
} else {
    $providedSecret = trim($authHeader);
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: [];

if (empty($providedSecret) && !empty($data['secret'])) {
    $providedSecret = trim($data['secret']);
}

if ($providedSecret !== $expectedSecret) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized: Invalid relay secret']);
    exit;
}

$to = trim($data['to'] ?? '');
$name = trim($data['name'] ?? 'Learner');
$subject = trim($data['subject'] ?? 'Notification from NexxSkill');
$html = $data['html'] ?? '';

if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid recipient email']);
    exit;
}

if (empty($html)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email body is required']);
    exit;
}

$fromEmail = $data['fromEmail'] ?? 'nexxskill39@gmail.com';
$fromName = $data['fromName'] ?? 'NexxSkill Technical Academy';

// 2. Fast Delivery via GoDaddy Native Sendmail (0.1s latency, 100% reliable on cPanel)
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$fromName} <{$fromEmail}>\r\n";
$headers .= "X-Mailer: NexxSkill-Relay/PHP-" . phpversion() . "\r\n";

$mailSent = @mail($to, $subject, $html, $headers);

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully via GoDaddy Mail',
        'method'  => 'GoDaddy Sendmail',
        'to'      => $to
    ]);
    exit;
}

// 3. Fallback to PHPMailer with GoDaddy local relay (relay-hosting.secureserver.net)
$mailerDir = __DIR__ . '/mailer';
if (file_exists($mailerDir . '/PHPMailer.php')) {
    require_once $mailerDir . '/Exception.php';
    require_once $mailerDir . '/PHPMailer.php';
    require_once $mailerDir . '/SMTP.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'relay-hosting.secureserver.net';
        $mail->Port       = 25;
        $mail->SMTPAuth   = false;
        $mail->SMTPSecure = false;
        $mail->Timeout    = 5;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to, $name);
        $mail->addReplyTo($fromEmail, $fromName);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $html;
        $mail->send();

        echo json_encode([
            'success' => true,
            'message' => 'Email sent via GoDaddy Relay PHPMailer',
            'method'  => 'GoDaddy Relay',
            'to'      => $to
        ]);
        exit;
    } catch (\Exception $e) {
        error_log("[MailRelay Error] " . $e->getMessage());
    }
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'error'   => 'Mail delivery failed on GoDaddy hosting'
]);
