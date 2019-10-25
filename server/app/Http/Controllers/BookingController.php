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
use App\Services\Stripe\Transaction;

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

    public static function checkIfBooked ($space_id, $expectedArrival){

        $booking = Booking::where('space_id', $space_id)
                            ->where('expected_arrival',Carbon::parse($expectedArrival)->setTimezone('Asia/Singapore')->toDateString())
                            ->whereRaw('JSON_CONTAINS(statuses, \'{"key": "paid"}\')')
                            ->whereRaw('not JSON_CONTAINS(statuses, \'{"key": "cancel"}\')')
                            ->first();

        return $booking;
    }

    public function book(Request $request) 
    {
       
        $booking = $this->checkIfBooked($request->space['id'],$request->expectedArrival);

        if($booking){
            return response()->json([
                'message' => 'There is currently booking, Choose another date',
                'state' => false
            ],422); 
        }

        $status = [(object)[
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

      
        $expected_arrival = Carbon::parse($booking->expected_arrival);
        
        if(Carbon::now()->lessThan($expected_arrival->addHour(1)) ) {
           
            $index = $this->searchArrayOfObject('paid',$booking->statuses);
          
            if( is_numeric($index) && !$this->searchArrayOfObject('checkIn',$booking->statuses) ){

                if(isset($booking->statuses[$index]['charge_id']) ){
                    $transact = Transaction::refund($booking->statuses[$index]['charge_id'],$booking->statuses[$index]['transfer_id']);

                    $status = (object) [
                        'key'=> 'cancel',
                        'value' => 'Successfully cancelled and refunded',
                        'reverse_id' => $transact['transfer']['id'],
                        'refund' => $transact['refund']['id'],
                        'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                    ];
    
                    $data = $booking->statuses;
                    array_push($data,$status);
                    $booking->statuses = $data;
                    $booking->save();
    
                    $newBooking = Booking::where('id',$booking->id)->with('space.payments')->get();
                    
                    return response()->json([
                        'message' => 'Cancel Booking and refunded the card, Thank you!',
                        'booking' => $newBooking,
                        'state' => true
                    ]);

                }else{

                    $status = (object) [
                        'key'=> 'cancel',
                        'value' => 'Successfully cancelled and refunded with cash',
                        'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                    ];
    
                    $data = $booking->statuses;
                    array_push($data,$status);
                    $booking->statuses = $data;
                    $booking->save();
    
                    $newBooking =  Booking::where('id',$booking->id)->with('user')->get();
                    
                    return response()->json([
                        'message' => 'Cancel Booking and refunded with cash, Thank you!',
                        'booking' => $newBooking,
                        'state' => true
                    ]);
                }
               

            }
            else {
                $status = (object) [
                    'key'=> 'cancel',
                    'value' => 'Successfully cancelled',
                    'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                ];

                $data = $booking->statuses;
                array_push($data,$status);
                $booking->statuses = $data;
                $booking->save();

                $newBooking = Booking::where('id',$booking->id)->with('space.payments')->get();
                
                return response()->json([
                    'message' => 'Cancel Booking',
                    'booking' => $newBooking,
                    'state' => true
                ]);

            }

        }else{
            return response()->json([
                'message' => 'not less than',
                'booking' => $booking,
                'state' => false
            ]);
        }
            
    }
    public function lessorCancelBooking(Booking $booking){
        $expected_arrival = Carbon::parse($booking->expected_arrival);
        
        if(Carbon::now()->lessThan($expected_arrival->addHour(1)) ) {
           
            $index = $this->searchArrayOfObject('paid',$booking->statuses);
          
            if( is_numeric($index) && !$this->searchArrayOfObject('checkIn',$booking->statuses) ){

                if(isset($booking->statuses[$index]['charge_id']) ){
                    $transact = Transaction::refund($booking->statuses[$index]['charge_id'],$booking->statuses[$index]['transfer_id']);

                    $status = (object) [
                        'key'=> 'cancel',
                        'value' => 'Successfully cancelled and refunded',
                        'reverse_id' => $transact['transfer']['id'],
                        'refund' => $transact['refund']['id'],
                        'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                    ];
    
                    $data = $booking->statuses;
                    array_push($data,$status);
                    $booking->statuses = $data;
                    $booking->save();
    
                    $newBooking =  Booking::where('id',$booking->id)->with('user')->get();
                    
                    return response()->json([
                        'message' => 'Cancel Booking and refunded the card, Thank you!',
                        'booking' => $newBooking,
                        'state' => true
                    ]);

                }else{

                    $status = (object) [
                        'key'=> 'cancel',
                        'value' => 'Successfully cancelled and refunded with cash',
                        'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                    ];
    
                    $data = $booking->statuses;
                    array_push($data,$status);
                    $booking->statuses = $data;
                    $booking->save();
    
                    $newBooking =  Booking::where('id',$booking->id)->with('user')->get();
                    
                    return response()->json([
                        'message' => 'Cancel Booking and refunded with cash, Thank you!',
                        'booking' => $newBooking,
                        'state' => true
                    ]);
                }
               

            }
            else {
                $status = (object) [
                    'key'=> 'cancel',
                    'value' => 'Successfully cancelled',
                    'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
                ];

                $data = $booking->statuses;
                array_push($data,$status);
                $booking->statuses = $data;
                $booking->save();

                $newBooking =  Booking::where('id',$booking->id)->with('user')->get();
                
                return response()->json([
                    'message' => 'Cancel Booking',
                    'booking' => $newBooking,
                    'state' => true
                ]);

            }

        }else{
            return response()->json([
                'message' => 'Cannot cancel a due date or need 1 hour before',
                'booking' => $booking,
                'state' => false
            ]);
        }
    }
    public function searchArrayOfObject($value, $arrayObject){
        
        $key = null;
        $key = array_search($value, array_column($arrayObject, 'key'));
        if(is_numeric($key)){
            return $key;
        }
            
        
        return false;
        
        
    }
}
