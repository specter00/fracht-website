<?php
/* Request form endpoint.
   Receives the request as JSON, e-mails it to the operator and sends a fixed
   confirmation to the sender. Stores no request and no IP address.
   Settings come from api/config.php, which build.js generates from config.js.
   Needs PHP 7.4 or newer with the mbstring extension and a working mail() function. */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/* Removes control characters, trims and limits the length. */
function clean($value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    if ($value === null) {
        return '';
    }
    return mb_substr(trim($value), 0, $max, 'UTF-8');
}

/* Same as clean(), but on a single line: safe for use in mail headers. */
function one_line($value, int $max): string
{
    return trim((string) preg_replace('/\s+/u', ' ', clean($value, $max)));
}

function header_text(string $text): string
{
    return mb_encode_mimeheader($text, 'UTF-8', 'B', "\r\n");
}

function send_mail(string $to, string $subject, string $body, array $headers, string $from): bool
{
    $body = str_replace("\r\n", "\n", $body);
    $body = wordwrap($body, 800, "\n", false);
    $body = str_replace("\n", "\r\n", $body);
    $head = implode("\r\n", $headers);
    if (@mail($to, header_text($subject), $body, $head, '-f' . $from)) {
        return true;
    }
    return @mail($to, header_text($subject), $body, $head); // some hosts do not allow -f
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$configFile = __DIR__ . '/config.php';
$cfg = is_file($configFile) ? require $configFile : null;
if (!is_array($cfg) || empty($cfg['enabled']) || empty($cfg['to']) || empty($cfg['from'])) {
    respond(503, ['ok' => false, 'error' => 'not_configured']);
}

/* Only accept requests that come from this website. */
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $originPort = parse_url($origin, PHP_URL_PORT);
    if ($originPort) {
        $originHost .= ':' . $originPort;
    }
    if ($originHost !== $host) {
        respond(403, ['ok' => false, 'error' => 'wrong_origin']);
    }
}

$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}

/* Honeypot: a filled hidden field means a bot. Answer as if all went well. */
if (clean($in['website'] ?? '', 200) !== '') {
    respond(200, ['ok' => true]);
}

$email = one_line($in['replyTo'] ?? '', 254);
$name = one_line($in['name'] ?? '', 120);
$company = one_line($in['company'] ?? '', 120);
$message = clean($in['message'] ?? '', 6000);

if (
    filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || $name === ''
    || $company === ''
    || mb_strlen($message, 'UTF-8') < 40
    || ($in['consent'] ?? false) !== true
) {
    respond(422, ['ok' => false, 'error' => 'invalid']);
}

/* Spam brake: counts requests in a time window. No IP address is stored. */
$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
$window = max(60, (int) ($cfg['windowSeconds'] ?? 600));
$limit = max(1, (int) ($cfg['maxPerWindow'] ?? 20));
$now = time();
$handle = @fopen($dir . '/rate.json', 'c+');
if ($handle !== false) {
    flock($handle, LOCK_EX);
    $list = json_decode((string) stream_get_contents($handle), true);
    $list = is_array($list) ? $list : [];
    $list = array_values(array_filter($list, static function ($t) use ($now, $window) {
        return is_int($t) && $t > $now - $window;
    }));
    if (count($list) >= $limit) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(429, ['ok' => false, 'error' => 'too_many_requests']);
    }
    $list[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, (string) json_encode($list));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

$from = (string) $cfg['from'];
$fromHeader = 'From: ' . header_text((string) $cfg['site']) . ' <' . $from . '>';
$common = ['MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit'];

/* 1. The request, to the operator. Replies go to the sender. */
$body = $message . "\n\n-- \nGesendet über das Anfrageformular am " . date('d.m.Y') . ' um ' . date('H:i') . " Uhr.\n";
$sent = send_mail(
    (string) $cfg['to'],
    (string) $cfg['subject'] . ': ' . $company,
    $body,
    array_merge([$fromHeader, 'Reply-To: ' . $email], $common),
    $from
);
if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'mail_failed']);
}

/* 2. Fixed confirmation to the sender. It contains no text typed into the form,
      so the form cannot be misused to send arbitrary content to third parties. */
$confirmBody = (string) ($cfg['confirmBody'] ?? '');
if ($confirmBody !== '') {
    send_mail(
        $email,
        (string) $cfg['confirmSubject'],
        $confirmBody . "\n",
        array_merge([$fromHeader, 'Reply-To: ' . (string) $cfg['to'], 'Auto-Submitted: auto-replied', 'X-Auto-Response-Suppress: All'], $common),
        $from
    );
}

respond(200, ['ok' => true]);
