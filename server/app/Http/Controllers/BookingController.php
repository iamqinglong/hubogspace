<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use App\User;
use Illuminate\Support\Facades\Auth;
class BookingController extends Controller
{
    //
    public function getMyBookings() 
    {
        $bookings = Booking::where('user_id', auth()->user()->id)->with('space')->get();
        // $bookings = auth()->user()->load(['bookings.space']);

        return response()->json([
            'bookings' =>  $bookings,
        ]);

    }
}
