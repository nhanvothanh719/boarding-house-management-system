<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceSendMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $invoice;
    protected $extra_fee;
    protected $renter_name;
    protected $room_number;
    protected $invoice_details;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($renter_name, $room_number, $invoice, $invoice_details, $extra_fee)
    {
        $this->renter_name = $renter_name;
        $this->room_number = $room_number;
        $this->invoice = $invoice;
        $this->extra_fee = $extra_fee;
        $this->invoice_details = $invoice_details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $invoice = $this->invoice;
        $extra_fee = $this->extra_fee;
        $renter_name = $this->renter_name;
        $room_number = $this->room_number;
        $invoice_details = $this->invoice_details;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.invoiceContent', compact('invoice', 'invoice_details', 'extra_fee', 'room_number', 'renter_name'))
        ->subject('Invoice content');
    }
}
