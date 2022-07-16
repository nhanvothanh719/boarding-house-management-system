<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        return [
            'name' => 'required|max:50',
            'email' => 'required|unique:users|max:50',
            'password' => 'required|min:6|confirmed',
            'gender' => 'required',
            'date_of_birth' => 'required|date|before_or_equal:'.$appropriate_time,
            'id_card_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10',
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10',
            'occupation' => 'required|max:100',
            'permanent_address' => 'required'
        ];
    }
}
