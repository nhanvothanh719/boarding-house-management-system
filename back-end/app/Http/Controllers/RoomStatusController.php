<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\RoomStatus;

class RoomStatusController extends Controller
{
    public function index() {
        $all_statuses = RoomStatus::all();
        return response([
            'status' => 200,
            'allStatuses' => $all_statuses,
        ]);
    }
}
