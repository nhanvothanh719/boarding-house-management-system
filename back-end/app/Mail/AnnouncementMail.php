<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AnnouncementMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $title;
    protected $content;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($title, $content)
    {
        $this->title = $title;
        $this->content = $content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $title = $this->title;
        $content = $this->content;
        return $this->from('boarding_house_admin@gmail.com')
        ->view('mail.announcementContent', compact('title', 'content'))
        ->subject('Announcement email');
    }
}

