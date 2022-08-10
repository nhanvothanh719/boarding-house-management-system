<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
<p>You received an alert sent from BeeHouse manager.</p>
    <p>Dear {{ $renter_name }},</p>
    <p>You violated the rules called {{ $breach_name }} of the boarding house at {{ $violate_at }}.</p>
    @if($remain_allowed_number > 0)
    <p>If you continue to violate this error {{ $remain_allowed_number }} more time(s), your account will be locked.</p>
    <p>Please pay more attention.</p>
    @else
    <p>Your account has been locked since you has violated too many times. </p>
    <p>Please contact with the boarding house manager to unlock it. </p>
    <p>Thank you.</p>
    @endif
</body>