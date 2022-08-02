<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <p>You received an email sent from BeeHouse.</p>
    <p>Bill from: <b>Manager of BeeHouse</b></p>
    <p>Bill to: {{ $renter_name }}</p>
    <br/>
    <p>Invoice no: {{ $invoice->id }}</p>
    <p>Invoice generate date: {{ $invoice->created_at }}</p>
    <p>Invoice can be paid from <b>{{ $invoice->effective_from }}</b> to <b>{{ $invoice->valid_until }}</b>.</p>
    
    <p>Below is details of the invoice: </p>
    <p>Room number: {{ $room_number }}</p>
    <p>All services used in {{ $invoice->month }}/{{ $invoice->year }}/ include: </p>
    <div id="email" style="width:600px;">
        <table role="presentation" border="1" width="100%">
            <tr>
                <td>Service ID</td>
                <td>Service name</td>
                <td>Is compulsory</td>
                <td>Amount</td>
                <td>Subtotal</td>
            </tr>
            @foreach($invoice_details as $service)
            <tr>
                <td>{{ $service->id }}</td>
                <td>{{ $service->service->name }}</td>
                @if( $service->service->is_compulsory  == 1)
                <td>Compulsory</td>
                @elseif($service->service->is_compulsory  == 0)
                <td>Optional</td>
                @endif
                <td>{{ $service->quantity }}</td>
                <td>{{ $service->subtotal }}</td>
            </tr>
            @endforeach
        </table>
        <br>
        <p>Discount: {{ $invoice->discount }}%</p>
        <p>Extra fee: {{ $extra_fee[0]->subtotal }}</p>
        <p>Description for extra fee: {{ $extra_fee[0]->description }}</p>
        <p style="display: inline;">Total: <b style="color: red; display: inline;">{{ $invoice->total }}</b></p>
        <br>
        <p style="display: inline;">Invoice condition: @if($invoice->is_paid == 0) <b style="display: inline;">Not paid</b> @else <b style="display: inline;">Paid</b> @endif</p>
</div>
</body>
</html>