<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use App\User;
use App\Space;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
class BookingController extends Controller
{
    //
    public function getMyBookings() 
    {
        $bookings = Booking::where('user_id', auth()->user()->id)
        ->orderBy('created_at','DESC')
        ->with('space')
        ->get();
        return response()->json([
            'bookings' =>  $bookings,
        ]);

    }
    public function book(Request $request) 
    {
        $status = [ (object)[
            'key'=> 'book',
            'value' => 'Just book',
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ]];

        $booking = Booking::create([
            'expected_arrival' =>    Carbon::parse($request->expectedArrival)->setTimezone('Asia/Singapore')->toDateTimeString(),
            'space_id' =>    $request->space['id'],
            'user_id' =>     auth()->user()->id,
            'payment_id' =>  1,// 2 is the payment_id of cash
            'statuses' =>    $status,
            ]);
        
        return response()->json([
            'message' => 'Book successful, Thank you!',
            'booking' => $booking,
            'state' => true
        ]); 

    }
    public function getSpaceBooking() 
    {
        $space = Booking::where('space_id',auth()->user()->space->id)->with('user')->get();
        return response()->json($space);

    }
}
