<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FirstPasswordChangeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $generatedPassword;
    public $generatedToken;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($password, $token)
    {
        $this->generatedPassword = $password;
        $this->generatedToken = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $generatedPassword = $this->generatedPassword;
        $generatedToken = $this->generatedToken;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.firstChangePassword', compact('generatedPassword', 'generatedToken'))
        ->subject('Email to give initial password');
    }
}
