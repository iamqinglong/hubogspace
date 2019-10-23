<?php

namespace App\Http\Controllers;
use Stripe\Account;
use Stripe\Stripe;
use Illuminate\Support\Facades\Auth;
// use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\User;
use Symfony\Component\HttpFoundation\Response;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request()->validate([
            'email' => 'required|email',
            'password' => 'required'
            ]);
        // return $credentials;
        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['errors' => ['result'=>'Unauthorized']], 401);
        }

        return $this->respondWithToken($token);
    }
    public function register()
    {
        request()->validate([
            'first_name'    => 'required',
            'last_name'    => 'required',
            'email'   => 'required|email',
            'password'=> 'required',
            'password_confirm' => 'required|same:password',
            'role' => 'required'
        ]);
        // return request('first_name');
        User::create([
            'first_name' => request('first_name'),
            'last_name' => request('last_name'),
            'email'    => request('email'),
            'password' => Hash::make(request('password')),
            'role' => request('role'),
        ]);

        return $this->login(request());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        
     
        if(is_null(auth()->user()->space)){
            $user = [
                'id' => auth()->user()->id,
                'first_name' => auth()->user()->first_name,
                'last_name' => auth()->user()->last_name,
                'role' => auth()->user()->role,
                'updated_at' => auth()->user()->update_at,
                'created_at' => auth()->user()->created_at,
            ];
        }
        else {
            $user = [
                'id' => auth()->user()->id,
                'first_name' => auth()->user()->first_name,
                'last_name' => auth()->user()->last_name,
                'role' => auth()->user()->role,
                'updated_at' => auth()->user()->update_at,
                'created_at' => auth()->user()->created_at,
                'space_name' => auth()->user()->space->name,
                'stripe_connect_id' => auth()->user()->stripe_connect_id,
                'payments' => auth()->user()->space->payments,
            ];
        }
        return response()->json($user);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
       
        
        if(is_null(auth()->user()->space)) {
            $user = [
                'id' => auth()->user()->id,
                'first_name' => auth()->user()->first_name,
                'last_name' => auth()->user()->last_name,
                'role' => auth()->user()->role,
                'updated_at' => auth()->user()->update_at,
                'created_at' => auth()->user()->created_at,
            ];
        }
        else {
            $user = [
                'id' => auth()->user()->id,
                'first_name' => auth()->user()->first_name,
                'last_name' => auth()->user()->last_name,
                'role' => auth()->user()->role,
                'updated_at' => auth()->user()->update_at,
                'created_at' => auth()->user()->created_at,
                'space_name' => auth()->user()->space->name,
                'stripe_connect_id' => auth()->user()->stripe_connect_id,
                'payments' => auth()->user()->space->payments,
            ];
        }
        
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
        ]);
    }

    public function getStripeAccount()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $account = Account::createLoginLink(auth()->user()->stripe_connect_id);
        return response()->json([
            'account' => $account
        ]);
    }
}