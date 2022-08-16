<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <p>Dear {{ $owner_name }}</p>
    <p>You received an email sent from BeeHouse manager.</p>
    <p>Your problem with title <b>{{ $problem_title }}</b> has been replied by {{ $responder_name }}.</p>
    <p>Please check.</p>
</body>
</html>