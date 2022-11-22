<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FirstPasswordChangeMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $generatedPassword;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($password)
    {
        $this->generatedPassword = $password;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $generatedPassword = $this->generatedPassword;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.firstChangePassword', compact('generatedPassword'))
        ->subject('Email to give initial password');
    }
}
