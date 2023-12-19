<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeHasIngredientRequest;
use App\Http\Requests\UpdateRecipeHasIngredientRequest;
use App\Http\Resources\RecipeHasIngredientResource;
use App\Models\RecipeHasIngredient;

class RecipeHasIngredientsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recipesHasIngredients = RecipeHasIngredient::all();
        return response()->json(['RecipesHasIngredient' => $recipesHasIngredients]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeHasIngredientRequest $request)
    {
        $data = $request->validated();
        $ingredientGroup = RecipeHasIngredient::create($data);

        return response()->json(['message' => 'Les Ingrédients ont été ajoutés à la recette', 'infos' => $ingredientGroup], 200);

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ingredientsRecipe = RecipeHasIngredient::all()->find($id);
        if (!$ingredientsRecipe){
            return response()->json(['message' => 'Groupe d\'ingrédients introuvables'], 404);
        }
        return response()->json($ingredientsRecipe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeHasIngredientRequest $request, RecipeHasIngredient $recipeHasIngredient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RecipeHasIngredient $recipeHasIngredient)
    {
        //
    }
}
