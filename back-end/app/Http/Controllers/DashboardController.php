<?php

namespace App\Http\Controllers;

use \stdClass;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Room;
use App\Models\Role;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\RoomStatus;
use App\Models\PaymentMethod;
use App\Models\InvoiceDetail;
use App\Models\BreachHistory;
use App\Models\PaymentHistory;

class DashboardController extends Controller
{
    public function countRentersByGender() {
        $renters_count = array();
        $genders_id = User::pluck('gender')->toArray();
        $genders_id = array_unique($genders_id);
        $role_renter_id = Role::where('name', Role::ROLE_RENTER)->value('id');
        foreach($genders_id as $gender_id) {
            $item = new stdClass();
            if($gender_id == User::GENDER_MALE_ID){
                $item->gender = "Male";
                $item->total = User::where('gender', $gender_id)->where('role_id', $role_renter_id)->count();
            }
            if($gender_id == User::GENDER_FEMALE_ID){
                $item->gender = "Female";
                $item->total = User::where('gender', $gender_id)->where('role_id', $role_renter_id)->count();
            }
            array_push($renters_count, $item);
        }
        return response([
            'status' => 200,
            'rentersCount' => $renters_count,
        ]);
    }

    public function countRoomsByStatus() {
        $rooms_count = array();
        $statuses_id = RoomStatus::pluck('id')->toArray();
        foreach($statuses_id as $status_id) {
            $item = new stdClass();
            $item->status = RoomStatus::find($status_id)->name;
            $item->total = Room::where('status_id', $status_id)->count();
            array_push($rooms_count, $item);
        }
        return response([
            'status' => 200,
            'roomsCount' => $rooms_count
        ]);
    }

    public function countUsedServices() {
        $used_services_count = array();
        $services_id = Service::pluck('id')->toArray();
        foreach($services_id as $service_id) {
            $item = new stdClass();
            $item->service_name = Service::where('id', $service_id)->value('name');
            $item->total = InvoiceDetail::where('service_id', $service_id )->count();
            array_push($used_services_count, $item);
        }
        return response([
            'status' => 200,
            'usedServicesCount' => $used_services_count
        ]);
    }

    public function getPaidInvoicesRate() {
        $invoice_paid_methods_count = array();
        $paid_invoices_count = Invoice::where('is_paid', Invoice::STATUS_PAID)->count();
        $total_invoices = Invoice::count();
        $paid_invoices_rate = $paid_invoices_count / $total_invoices * 100;
        $payment_methods_id = PaymentMethod::pluck('id')->toArray();
        foreach($payment_methods_id as $payment_method_id) {
            $item = new stdClass();
            $item->payment_method = PaymentMethod::where('id', $payment_method_id)->value('name');
            $item->total = PaymentHistory::where('payment_method_id', $payment_method_id )->count();
            array_push($invoice_paid_methods_count, $item);
        }
        return response([
            'status' => 200,
            'paidInvoicesRate' => round($paid_invoices_rate),
            'invoicePaidMethodsCount' => $invoice_paid_methods_count,
        ]);
    }

    public function reportBreaches() {
        $current_month = 11;
        $months_in_year = 12;
        $breaches_in_month_count = array();
        for($month = 1; $month <= $months_in_year; $month++) {
            $total_breaches_in_month = BreachHistory::whereYear('violate_at', date('Y'))
            ->whereMonth('violate_at', $month)->count();
            $item = new stdClass();
            $item->month = $month;
            if($month <= $current_month) {
                $item->total_breaches_in_month = $total_breaches_in_month;
            }
            array_push($breaches_in_month_count, $item);
        }
        return response([
            'status' => 200,
            'breachesInMonthCount' => $breaches_in_month_count,
        ]);
    }
}
