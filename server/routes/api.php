<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::post('register', 'AuthController@register');
    Route::get('getStripeAccount', 'AuthController@getStripeAccount');
    
});



Route::group(['middleware' => 'api'], function() {

    Route::resource('spaces', 'SpaceController');
    Route::get('getSpace', 'SpaceController@getSpace');
    Route::get('getAllSpaces', 'SpaceController@getAllSpaces');
    Route::post('stripe', 'SpaceController@saveStripe');

    Route::post('bookAndPayStripe', 'PaymentController@bookAndPayStripe');
    Route::post('payInCash/{booking}', 'PaymentController@payInCash');
    Route::post('payWithStripe/{booking}', 'PaymentController@payWithStripe');
    Route::post('bookerPayWithStripe/{booking}', 'PaymentController@bookerPayWithStripe');

    Route::get('getMyBookings', 'BookingController@getMyBookings');
    Route::post('book', 'BookingController@book');
    Route::post('getSpaceBooking', 'BookingController@getSpaceBooking');
    Route::post('getSpaceWithBookings', 'BookingController@getSpaceWithBookings');
    Route::post('checkIn/{booking}', 'BookingController@checkIn');
    Route::post('checkOut/{booking}', 'BookingController@checkOut');
    
});


