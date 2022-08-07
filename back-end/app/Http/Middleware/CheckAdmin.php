<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
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
        if(Auth::check()) {
            //Check abilities using token
            if (auth()->user()->tokenCan('use-dashboard')) {
                return $next($request);
            }
            else {
                return response([
                    'message' => 'Access is denied. You must be the admin!',
                ], 403);
            }
        }
        else {
            return response([
                'message' => 'Please login first',
                'status' => 401,
            ]);
        }
    }
}
