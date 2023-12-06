<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDifficultyRequest;
use App\Http\Requests\UpdateDifficultyRequest;
use App\Http\Resources\DifficultyResource;
use App\Models\Difficulty;

class DifficultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $difficulty = Difficulty::all();
        return response()->json(['difficulty' => $difficulty]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDifficultyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Difficulty $difficulty)
    {
        return new DifficultyResource($difficulty);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDifficultyRequest $request, Difficulty $difficulty)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Difficulty $difficulty)
    {
        //
    }
}
