<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DifficultyController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\TagController;
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

Route::middleware('auth:sanctum')->group(function () {
    //ROUTE FOR USERS METHODS
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user/recipes', [RecipeController::class, 'getUserRecipes']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/user/{user}', [UserController::class, 'update']);
    Route::delete('/user/{user}', [UserController::class, 'destroy']);


    //ROUTE FOR RECIPE METHODS
    Route::post('/recipes/', [RecipeController::class, 'store']);
    Route::put('/recipe/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipe/{recipe}', [RecipeController::class, 'destroy']);

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);
});

//Authentication
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

//Public Routes
Route::apiResource('/tags', TagController::class);
Route::apiResource('/ingredients', IngredientController::class);
Route::apiResource('/difficulties', DifficultyController::class);
Route::apiResource('/images', ImageController::class);

//Public Routes for Recipes
Route::group([], function () {
    //CRUD
    Route::get('/recipes', [RecipeController::class, 'index']);
    Route::get('/recipe/{recipe}', [RecipeController::class, 'show']);
    //Other Routes
    Route::get('/recipes/{parentTag}', [RecipeController::class, 'getRecipesByParentTag']);
});
