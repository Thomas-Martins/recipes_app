<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DifficultyController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\TagController;
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
    Route::post('/logout',[AuthController::class, 'logout']);
});
//route public
Route::group([], function () {
    Route::get('/recipes/{parentTagName}', [RecipeController::class, 'getRecipesByParentTagName']);
    Route::apiResource('/recipes', RecipeController::class);
    // Les autres routes pour les utilisateurs, les ingrédients, les tags, les difficultés, etc.
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/ingredients', IngredientController::class);
    Route::apiResource('/tags', TagController::class);
    Route::apiResource('/difficulties', DifficultyController::class);
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
});







