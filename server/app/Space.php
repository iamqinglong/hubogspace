<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Payment;
use App\Image;
use App\User;
use App\Booking;
use App\Review;

class Space extends Model
{
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
        return $this->hasMany(Booking::class)->orderBy('created_at','DESC');;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->orderBy('created_at','DESC');;
    }
}
