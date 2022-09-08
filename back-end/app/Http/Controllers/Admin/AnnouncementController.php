<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Models\Announcement;

use App\Jobs\SendAnnouncementMail;
use App\Mail\AnnouncementMail;

class AnnouncementController extends Controller
{
    public function sendAnnouncement(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'content' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
        ]);
        $renters_id = $request->all_id;
        //Send email
        foreach ($renters_id as $renter_id) {
            $renter = User::find($renter_id);
            $announcementMail = new AnnouncementMail($announcement->title, $announcement->content);
            $sendAnnouncementEmailJob = new SendAnnouncementMail($renter, $announcementMail);
            dispatch($sendAnnouncementEmailJob); //Push(Add) this job into queue
        }
        return response([
            'message' => "Successfully send announcement",
            'status' => 200,
        ]);
    }
}
