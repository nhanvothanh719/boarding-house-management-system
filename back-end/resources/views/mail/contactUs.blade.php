<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <p>You received an email sent from Contact us form.</p>
    <p>This was send from {{ $senderName }} whose email is {{ $senderEmail }}. </p>
    <p>Message: {{ $contactMessage }} </p>
    <p>Please contact with him (her) as soon as possible.</p>
</body>
</html>