<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRenter
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check()) { //Check user is authenticated or not
            //Check abilities using token
            if (auth()->user()->tokenCan('perform-renter-work')) {
                return $next($request);
            }
            else {
                return response([
                    'message' => 'Access is denied. You must be the renter!',
                ], 403);
            }
        }
        else {
            return response([
                'message' => 'Please login first',
                'status' => 401, //unauthenticated
            ]);
        }
    }
}
