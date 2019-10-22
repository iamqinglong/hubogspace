<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use Carbon\Carbon;
use Stripe\Charge;
use Stripe\Stripe;
use Stripe\Transfer;
use App\Space;
use App\Services\Stripe\Transaction;

class PaymentController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    public function bookAndPayStripe(Request $request)
    {
        // try {
            $space = Space::find($request->space['id']);
            $owner = $space->user;
            $payout = $this->stripeAmountFormat($request->space['price']) * 0.50;
            Stripe::setApiKey(env('STRIPE_SECRET'));
            $charge = Charge::create ([
                    "amount" => $this->stripeAmountFormat($request->space['price']),
                    "currency" => "usd",
                    "source" => $request->token['id'],  
                    "description" => "Thank you for patronizing" 
            ]);

            Transfer::create([
                'amount' => $payout,
                "currency" => "usd",
                "source_transaction" => $charge->id,
                'destination' => $owner->stripe_connect_id
            ]);

            $status = [ (object)[
                'key'=> 'paid',
                'value' => 'Paid with Card',
                'charge_id' => $charge->id,
                'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
            ]];

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
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'There were some issue with the payment. Please try again later.',
        //         'state' => false
        //     ]);
        // }
       
      
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

        return response()->json([
            'message' => 'Paid in cash successful, Thank you',
            'state' => true
        ]);
      
    }

    public function payWithStripe(Booking $booking){

        $charge_id = Transaction::create(auth()->user(), request()->token['id'],$booking->space->price);

        $status = (object) [
            'key'=> 'paid',
            'value' => 'Paid in cash',
            'charge_id' => $charge_id,
            'date' => Carbon::parse(time())->setTimezone('Asia/Singapore')->toDateTimeString()
        ];

        $stats = $booking->statuses;
        array_push($stats,$status);
        $booking->statuses = $stats;
        $booking->save();

        return response()->json([
            'message' => 'Paid with Stripe successful, Thank you',
            'state' => true
        ]);

    }

    public function stripeAmountFormat($amount)
    {
        return $amount * 100;
    }
}
