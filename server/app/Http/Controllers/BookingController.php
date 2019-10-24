<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use App\User;
use App\Space;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Uuid;

class BookingController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }

    public function getMyBookings() 
    {
        $bookings = Booking::where('user_id', auth()->user()->id)
        ->orderBy('created_at','DESC')
        ->with('space.payments')
        ->get();
        return response()->json([
            'bookings' =>  $bookings,
        ]);

    }
    public function book(Request $request) 
    {
        $status = [ (object)[
            'key'=> 'book',
            'value' => 'Just Booked',
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

    public function getSpaceWithBookings(){
        $space = Space::where('user_id',auth()->user()->id)
                        ->with(['payments','bookings.user'])
                        ->get();
        return response()->json($space);
    }

    public function checkIn(Booking $booking) {

        $imageName = $this->saveImage(request());
        
        $status = (object) [
            'key'=> 'checkIn',
            'value' => 'Checked-in',
            'image' => $imageName,
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $data = $booking->statuses;
        array_push($data,$status);
        $booking->statuses = $data;
        $booking->save();

        $retrieveBooking = Booking::where('id',$booking->id)->with('user')->get();

        return response()->json([
            'message' => 'Checked-in successful, Thank you!',
            'booking' => $retrieveBooking,
            'state' => true
        ]);
    }

    public function checkOut(Booking $booking){
       
        $imageName = $this->saveImage(request());

        $status = (object) [
            'key'=> 'checkOut',
            'value' => 'Checked-out',
            'image' => $imageName,
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $data = $booking->statuses;
        array_push($data,$status);
        $booking->statuses = $data;
        $booking->save();

        $retrieveBooking = Booking::where('id',$booking->id)->with('user')->get();

        return response()->json([
            'message' => 'Checkeed-out successful, Thank you!',
            'booking' => $retrieveBooking,
            'state' => true
        ]);
    }

    public function saveImage(){

        $image = request('signature');  // your base64 encoded
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = Uuid::generate(4)->string . '.png';

        Storage::disk('local')->put($imageName, base64_decode($image));

        return $imageName;
    }

    public function bookerCancelBooking(Booking $booking){

        return response()->json([
            'message' => 'Cancel Booking and refunded, Thank you!',
            'booking' => $booking,
            'state' => true
        ]);
        
    }
}
