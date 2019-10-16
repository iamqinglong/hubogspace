<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Payment;
use App\Image;

class Space extends Model
{
    //
    public function payment(){
        return $this->belongsToMany(Payment::class);
    }
   public function images()
   {
       return $this->hasMany(Image::class);
   }
}
