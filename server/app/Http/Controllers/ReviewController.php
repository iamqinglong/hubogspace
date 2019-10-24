<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use App\Review;
use Carbon\Carbon;

class ReviewController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }

    public function reviewAndRate(Booking $booking){

        request()->validate([
            'description'=> 'required|max:255',
            'rate' => 'required|numeric|min:1',
        ]);

        $review = Review::create([
            'description' => request('description'),
            'rate' => request('rate'),
            'user_id' => auth()->user()->id,
            'space_id' => $booking->space_id
        ]);
        
        $status = (object) [
            'key'=> 'reviewed',
            'value' => 'Succesfully rated and reviewed',
            'description' => $review->description,
            'rate' => $review->rate,
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $data = $booking->statuses;
        array_push($data,$status);
        $booking->statuses = $data;
        $booking->save();
        
        $newBooking = Booking::where('id',$booking->id)->with('space.payments')->get();

        return response()->json([
            'booking'=> $newBooking,
            'message' => 'Review and Rate accepted, Thank you!',
            'state' => true
        ], 200);
    }
}
