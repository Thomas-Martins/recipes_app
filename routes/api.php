<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use \App\Http\Controllers\Api\RecipeController;
use \App\Http\Controllers\Api\IngredientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request){
        return $request->user();
    });
//    Route::post('/logout',[AuthController::class, 'logout']);

});
//route public
//Route::get('users',[UserController::class,'index']);
Route::apiResource('recipes',RecipeController::class);
Route::apiResource('/users', UserController::class);
Route::apiResource('/ingredients', IngredientController::class);
//Route::get('test',[\App\Http\Controllers\Controller::class, 'test']);
