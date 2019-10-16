<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Space;

class Image extends Model
{
  
    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
