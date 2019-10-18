<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Payment;
use App\Image;
use App\User;
use App\Booking;

class Space extends Model
{
    //
    protected $fillable = ['name','price','contact','description','address','longitude','latitude','user_id'];
    public function payments(){
        return $this->belongsToMany(Payment::class)->withTimestamps();
    }
    
    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
