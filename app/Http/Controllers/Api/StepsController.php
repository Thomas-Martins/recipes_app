<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStepsRequest;
use App\Http\Requests\UpdateStepsRequest;
use App\Models\Steps;

class StepsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStepsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Steps $steps)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStepsRequest $request, Steps $steps)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Steps $steps)
    {
        //
    }
}
