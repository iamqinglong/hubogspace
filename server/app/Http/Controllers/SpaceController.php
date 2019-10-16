<?php

namespace App\Http\Controllers;

use App\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['show','index']]);
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
            'contact'   => 'required|number|min:11|max:11',
            'description'=> 'required|max:255',
            'payments' => 'required|min:1',
            'address' => 'required',
            'pictures' => 'file|image|max:5000',
            'geolocation' => 'required',
        ]);
        return response()->json($request->all(), 200);
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
