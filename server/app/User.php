<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Role;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Space;
use App\Booking;
use App\Review;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name','last_name', 'email', 'password', 'role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function roles() 
    {
        
        return $this->belongsToMany(Role::class);
        
    }

      /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function space()
    {
        return $this->hasOne(Space::class);
    }

    public function bookings() 
    {
        
        return $this->hasMany(Booking::class);
        
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->orderBy('created_at','DESC');;
    }
    
    public function receivesBroadcastNotificationsOn()
    {
        return 'App.User.' . $this->id;
    }
}
