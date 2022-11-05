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
    protected $renter_name;
    protected $room_number;
    protected $room_price;
    protected $invoice_details;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($renter_name, $room_number, $room_price, $invoice, $invoice_details)
    {
        $this->renter_name = $renter_name;
        $this->room_number = $room_number;
        $this->room_price = $room_price;
        $this->invoice = $invoice;
        $this->invoice_details = $invoice_details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $invoice = $this->invoice;;
        $renter_name = $this->renter_name;
        $room_number = $this->room_number;
        $room_price = $this->room_price;
        $invoice_details = $this->invoice_details;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.invoiceContent', compact('invoice', 'invoice_details', 'room_number', 'room_price', 'renter_name'))
        ->subject('Invoice content');
    }
}
