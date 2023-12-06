<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use App\Models\Tag;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recipe = Recipe::all();
        return response()->json(['recipe' => $recipe]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request)
    {
        $data = $request->validated();
        $recipe = Recipe::create($data);
        if ($recipe) {
//            return response(new RecipeResource($recipe), 201);
            return response()->json(['message' => 'Recette créée avec succès'], 201);
        } else {
            return response()->json(['message' => 'Erreur lors de la création de la recette'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe)
    {
        return new RecipeResource($recipe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, Recipe $recipe)
    {
        $data = $request->validated();
//        return response()->json($data);
        $update = $recipe->update($data);
        if ($update) {
            return response()->json(['message' => 'Recette modifié avec succès']);
        } else {
            return response()->json(['message' => 'Echec de la modification']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return response('La recette a bien été supprimer!', 201);
    }
    
    public function getRecipesByParentTagName($parentTagName): \Illuminate\Http\JsonResponse
    {
        $tag = Tag::where('tag_name', $parentTagName)->first();

        if ($tag) {
            // Récupérer les recettes avec le tag parent
            $recipesWithParentTag = $tag->recipesByParentTag($parentTagName);

            // Récupérer les recettes avec le tag direct sans parent
            $directTag = Tag::where('tag_name', $parentTagName)->whereNull('parent_tag_id')->first();
            $recipesWithDirectTag = [];
            if ($directTag) {
                $recipesWithDirectTag = $directTag->recipes;
            }

            // Combiner les deux ensembles de recettes
            $recipes = $recipesWithParentTag->merge($recipesWithDirectTag);

            return response()->json(['recipes' => $recipes]);
        } else {
            return response()->json(['message' => 'Aucun tag parent trouvé pour ce nom']);
        }
    }

}
