<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactUsMail extends Mailable
{
    use Queueable, SerializesModels;

    // public $email;
    // public $name;
    // public $message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $email, $message)
    {
        $this->senderEmail = $email;
        $this->senderName = $name;
        $this->contactMessage = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $senderEmail = $this->senderEmail;
        $senderName = $this->senderName;
        $contactMessage = $this->contactMessage;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.contactUs', compact('senderName', 'senderEmail', 'contactMessage'))
        ->subject('Email sent from Contact us form');
    }
}

