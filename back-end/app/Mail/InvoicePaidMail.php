<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoicePaidMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $month;
    protected $year;
    protected $amount;
    protected $payment_method;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($month, $year, $amount, $payment_method)
    {
        $this->month = $month;
        $this->year = $year;
        $this->amount = $amount;
        $this->payment_method = $payment_method;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $month = $this->month;
        $year = $this->year;
        $amount = $this->amount;
        $payment_method = $this->payment_method;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.invoicePaidConfirmation', compact('month', 'year', 'amount', 'payment_method'))
        ->subject('Invoice paid confirmation email');
    }
}
