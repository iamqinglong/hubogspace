<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Space;

class Payment extends Model
{
    public function spaces() 
    {
        
        return $this->belongsToMany(Space::class);
        
    }
}
