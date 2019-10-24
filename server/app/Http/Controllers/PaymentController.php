<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use Carbon\Carbon;
use Stripe\Charge;
use Stripe\Stripe;
use Stripe\Transfer;
use App\Space;
use App\User;
use App\Services\Stripe\Transaction;
use App\Http\Controllers\BookingController;

class PaymentController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    public function bookAndPayStripe(Request $request)
    {
        try {
            
            $booking = BookingController::checkIfBooked($request);
            if($booking){
                return response()->json([
                    'message' => 'There is currently booking, Choose another date',
                    'state' => false
                ],422);
            }
            $space = Space::find($request->space['id']);
            $owner = $space->user;
            $payout = $this->stripeAmountFormat($request->space['price']) * 0.50;

            $data = Transaction::create($owner, $request->token['id'],$request->space['price']);

            $status = [ (object)[
                'key'=> 'paid',
                'value' => 'Booked and Paid with Card ',
                'charge_id' => $data['charge_id'],
                'transfer_id' => $data['transfer_id'],
                'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
            ],
            ];

            $booking = Booking::create([
                'expected_arrival' =>    Carbon::parse($request->expectedArrival)->setTimezone('Asia/Singapore')->toDateTimeString(),
                // 'check_out' =>  Carbon::parse($request->expectedArrival)->setTimezone('Asia/Singapore')->toDateTimeString(),
                'space_id' =>    $request->space['id'],
                'user_id' =>     auth()->user()->id,
                'payment_id' =>  2,// 2 is the payment_id of card
                'statuses' =>    $status,
            ]);
            
            return response()->json([
                'message' => 'Book and Charge successful, Thank you!',
                'booking' => $booking,
                'state' => true
            ]); 

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There were some issue with the payment. Please try again later.',
                'state' => false
            ]);
        }
       
    }
    public function payInCash(Booking $booking){
        
        $status = (object) [
            'key'=> 'paid',
            'value' => 'Paid in cash',
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $stats = $booking->statuses;
        array_push($stats,$status);
        $booking->statuses = $stats;
        $booking->save();
        
        $data = Booking::where('id',$booking->id)->with('user')->get();

        return response()->json([
            'message' => 'Paid in cash successful, Thank you',
            'data' => $data,
            'state' => true
        ]);
      
    }

    public function payWithStripe(Booking $booking){

        try {

           
            $this->payWithStripeHelper(auth()->user(), $booking,request()->token['id'],$booking->space->price);

            $data = Booking::where('id',$booking->id)->with('user')->get();

            return response()->json([
                'message' => 'Paid with Stripe successful, Thank you',
                'data' => $data,
                'state' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There were some issue with the payment. Please try again later.',
                'state' => false
            ]);
        }

    }

    public function bookerPayWithStripe(Booking $booking){

        try {
            $user = User::find($booking->space->user_id);
            $this->payWithStripeHelper($user,$booking, request()->token['id'], $booking->space->price);

            $data = Booking::where('id',$booking->id)->with('space.payments')->get();

            return response()->json([
                'message' => 'Paid with Stripe successful, Thank you.',
                'data' => $data,
                'state' => true
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'There were some issue with the payment. Please try again later.',
                'state' => false
            ]);
        }
        
        
    }
    public function payWithStripeHelper(User $user, Booking $booking,$token_id, $price)
    {
        
        $data = Transaction::create($user, $token_id,$price);

        $status = (object) [
            'key'=> 'paid',
            'value' => 'Paid with Card',
            'charge_id' => $data['charge_id'],
            'transfer_id' => $data['transfer_id'],
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $stats = $booking->statuses;
        array_push($stats,$status);
        $booking->statuses = $stats;
        $booking->save();
    }
    public function stripeAmountFormat($amount)
    {
        return $amount * 100;
    }
}
