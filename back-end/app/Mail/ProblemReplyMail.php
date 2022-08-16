<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProblemReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $owner_name;
    protected $problem_title;
    protected $responder_name;
    protected $replied_text;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($owner_name, $problem_title, $responder_name, $replied_text)
    {
        $this->owner_name = $owner_name;
        $this->problem_title = $problem_title;
        $this->responder_name = $responder_name;
        $this->replied_text = $replied_text;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $owner_name = $this->owner_name;
        $problem_title = $this->problem_title;
        $responder_name = $this->responder_name;
        $replied_text = $this->replied_text;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.replyProblem', compact('owner_name', 'problem_title', 'responder_name', 'replied_text'))
        ->subject('Reply from admin to problem');
    }
}
