<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    public function payWithStripe(Request $request)
    {
        return response()->json($request->all(), 200);
        // Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        // Stripe\Charge::create ([
        //         "amount" => $request->space->price * 100,
        //         "currency" => "usd",
        //         "source" => $request->stripeToken,
        //         "description" => "Thank you for patronizing" 
        // ]);
    }
}
