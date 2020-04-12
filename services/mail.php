<?php
$to      = 'contact@qian-ma.com';

$subject = 'the subject';
$my_var = "hello";

$message = 'Hello \r\n';
$message .= 'World \r\n';
$message .= '&Moon \r\n';

$headers = 'From: contact@qian-ma.com' . "\r\n" .
    'Reply-To: contact@qian-ma.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

// this is for testing 
print('$message');
?>