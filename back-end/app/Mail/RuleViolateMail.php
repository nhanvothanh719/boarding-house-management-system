<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RuleViolateMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $renter_name;
    protected $breach_name;
    protected $violate_at;
    protected $remain_allowed_number;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($renter_name, $breach_name, $violate_at, $remain_allowed_number)
    {
        $this->renter_name = $renter_name;
        $this->breach_name = $breach_name;
        $this->violate_at = $violate_at;
        $this->remain_allowed_number = $remain_allowed_number;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $renter_name = $this->renter_name;
        $breach_name = $this->breach_name;
        $violate_at = $this->violate_at;
        $remain_allowed_number = $this->remain_allowed_number;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.ruleViolate', compact('renter_name', 'breach_name', 'violate_at', 'remain_allowed_number'))
        ->subject('Rule violating alert email');
    }
}
