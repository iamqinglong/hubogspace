<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Booking;
use Carbon\Carbon;
use Stripe\Charge;
use Stripe\Stripe;
use Stripe\Transfer;
use App\Space;

class PaymentController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    public function payWithStripe(Request $request)
    {
        try {
            $space = Space::find($request->space['id']);
            $owner = $space->user;
            $payout = $request->amount * 0.50;
            Stripe::setApiKey(env('STRIPE_SECRET'));
            $charge = Charge::create ([
                    "amount" => $request->amount,
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

            $status = [
                'key'=> 'paid',
                'value' => 'Paid with Card',
                'charge_id' => $charge->id,
                'date' => time()
            ];
            // return response()->json($status);
            $booking = Booking::create([
                'check_in' =>    Carbon::parse($request->checkIn)->setTimezone('Asia/Singapore')->toDateTimeString(),
                'check_out' =>  Carbon::parse($request->checkOut)->setTimezone('Asia/Singapore')->toDateTimeString(),
                'space_id' =>    $request->space['id'],
                'user_id' =>     auth()->user()->id,
                'payment_id' =>  2,// 2 is the payment_id of card
                'statuses' =>    $status,
                ]);
            
            return response()->json([
                'message' => 'Charge successful, Thank you for payment!',
                'booking' => $booking,
                'state' => 'success'
            ]); 
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There were some issue with the payment. Please try again later.',
                'state' => 'error'
            ]);
        }
       
      
    }
}
