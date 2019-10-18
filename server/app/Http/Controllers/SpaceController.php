<?php

namespace App\Http\Controllers;

use App\Space;
use App\Image;
use Illuminate\Http\Request;

class SpaceController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['show','index','getAllSpaces']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name'    => 'required',
            'price'    => 'required',
            'contact'   => 'required|numeric|digits:11',
            'description'=> 'required|max:255',
            'payments' => 'required|min:1',
            'address' => 'required',
            'pictures' => 'required',
            'pictures.*.file' => 'file|image|max:5000|mimes:jpeg,png,jpg',
            'longitude' => 'required',
            'latitude' => 'required',
        ]);
        
        $space = Space::create([
                    'name' =>    $request->name,
                    'price' =>    $request->price,
                    'contact' =>    $request->contact,
                    'description' =>    $request->description,
                    'address' =>    $request->address,
                    'longitude' =>    $request->longitude,
                    'latitude' =>    $request->latitude,
                    'user_id' =>    $request->user_id,
                    ]);
        $space->payments()->sync(request('payments'));
        foreach ($request->pictures as $image) {
            Image::create([
                'space_id' => 1,
                'filename' => $image->store('uploads','public')
            ]);
        }
        return response()->json($request->all(), 200);
        
    }
    public function getSpace() {
       
        return response()->json([
            'space' => auth()->user()->space,
            'payments' => auth()->user()->space->payments,
            'images' => auth()->user()->space->images,
        ], 200);
    }
    public function getAllSpaces() {
        $spaces = Space::with('images')->get();
        return response()->json($spaces, 200);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Space  $space
     * @return \Illuminate\Http\Response
     */
    public function show(Space $space)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Space  $space
     * @return \Illuminate\Http\Response
     */
    public function edit(Space $space)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Space  $space
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Space $space)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Space  $space
     * @return \Illuminate\Http\Response
     */
    public function destroy(Space $space)
    {
        //
    }
}
