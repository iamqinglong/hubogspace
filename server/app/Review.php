<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Space;

class Review extends Model
{
    //
    protected $fillable = [
        'rate', 'space_id', 'user_id', 'description'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
