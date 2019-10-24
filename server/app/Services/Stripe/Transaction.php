<?php

namespace App\Services\Stripe;

use App\User;
use Stripe\Charge;
use Stripe\Stripe;
use Stripe\Transfer;
use Stripe\Refund;
class Transaction
{
    public static function create(User $user, $token_id, $price)
    {

        $payout = $price * 0.90;

        Stripe::setApiKey(config('services.stripe.secret'));

        $charge = Charge::create([
            'amount' => self::toStripeFormat($price),
            'currency' => 'usd',
            'source' => $token_id,
            'description' => 'Successfully paid ' .$user->first_name . ', Thank you for patronizing'
        ]);

        $transfer = Transfer::create([
            'amount' => self::toStripeFormat($payout),
            "currency" => "usd",
            "source_transaction" => $charge->id,
            'destination' => $user->stripe_connect_id
        ]);
        
        return [
            'charge_id' => $charge->id,
            'transfer_id' => $transfer->id
        ];
    }
    
    public static function refund($charge_id,$transfer_id)
    {

        Stripe::setApiKey(config('services.stripe.secret'));

        $transfer = Transfer::createReversal($transfer_id);

        $refund = Refund::create([
            "charge" => $charge_id,
          ]);
        
        return [
            'refund' => $refund,
            'transfer' => $transfer
        ];
    }
    public static function toStripeFormat(float $price)
    {
        return $price * 100;
    }
}