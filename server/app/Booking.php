<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Space;

class Booking extends Model
{
    //
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
