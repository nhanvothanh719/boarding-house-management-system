<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    Hello new user,
    <br >
    Welcome to BeeHouse application,
    <br >
    Your password used for login into the system is: <b>{{ $generatedPassword }}</b>
    <br >
    If you want to change, please click <a href="http://localhost:3000/reset-password/{{ $generatedToken }}"> the following link </a> to reset your password.
    <br>
    Your pincode is: <h3>{{ $generatedToken }}</h3>
    <br>
    If you did not request a password change, please feel free to ignore this message.
    <br>
    Please feel free to respond to this email.
    It was sent from a monitored email address, and we would love to hear from you.
</body>
