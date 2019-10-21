<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Space;
use App\Payment;
use App\Booking;

class Booking extends Model
{
    //
    protected $casts = [
        'statuses' => 'array'
    ];
    protected $fillable = [
        'check_in','check_out', 'space_id', 'payment_id', 'user_id', 'statuses'
    ];
    protected $dates = [
        'check_in', 'check_out'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function payment(){
        return $this->belongsTo(Payment::class);
    }
    
    // public function bookings()
    // {
    //     return $this->hasMany(Booking::class);
    // }
}
