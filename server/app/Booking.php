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
        'expected_arrival', 'space_id', 'payment_id', 'user_id', 'statuses'
    ];
    protected $dates = [
        'expected_arrival',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function payments(){
        return $this->belongsToMany(Payment::class)->withTimestamps();
    }
    
    // public function bookings()
    // {
    //     return $this->hasMany(Booking::class);
    // }
}
