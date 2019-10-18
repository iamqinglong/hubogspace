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

});

Route::group(['middleware' => 'api'], function() {

    Route::resource('spaces', 'SpaceController');
    Route::get('getSpace', 'SpaceController@getSpace');
    Route::get('getAllSpaces', 'SpaceController@getAllSpaces');
});

Route::group(['middleware' => 'api'], function() {

    Route::post('payWithStripe', 'PaymentController@payWithStripe');
});