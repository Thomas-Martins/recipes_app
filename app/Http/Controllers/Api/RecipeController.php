<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Image;
use App\Models\Recipe;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
//        $recipe = Recipe::all();
//        return response()->json(['recipe' => $recipe]);

        $recipes = Recipe::with('image')->get();
        $recipesData = $recipes->map(function ($recipe) {
            return [
                'recipe' => $recipe,
            ];
        });
        return response()->json(['recipes' => $recipesData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request)
    {
//        $data = $request->validated();
//        $recipe = Recipe::create($data);
//        if ($recipe) {
////            return response(new RecipeResource($recipe), 201);
//            return response()->json(['message' => 'Recette créée avec succès'], 201);
//        } else {
//            return response()->json(['message' => 'Erreur lors de la création de la recette'], 500);
//        }

//        // Récupérer les données de la recette depuis le formulaire
//        $recipeData = $request->validated(); // Ajoutez d'autres champs ici
//
//        // Enregistrer la recette dans la base de données
//        $recipe = Recipe::create($recipeData);
//
//        // Récupérer l'ID de l'image envoyée
//        $imageId = $request->input('image_id');
//
//        // Associer l'ID de l'image à la recette
//        $recipe->id_image = $imageId;
//        $recipe->save();
//
//        return response()->json(['message' => 'Recipe created successfully'], 200);

        // Récupérer les données de la recette depuis le formulaire
        $recipeData = $request->validated(); // Ajoutez d'autres champs ici

        // Enregistrer l'image et récupérer l'ID de l'image
        $imageUploadResponse = $this->uploadImage($request);

        if ($imageUploadResponse->getStatusCode() === 200) {
            $imageId = $imageUploadResponse->getData()->image_id;

            // Enregistrer la recette dans la base de données
            $recipe = Recipe::create($recipeData);

            // Associer l'ID de l'image à la recette
            $recipe->id_image = $imageId;
            $recipe->save();

            return response()->json(['message' => 'Recipe created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to upload image'], 500);
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
            $recipesWithParentTag = $tag->recipesByParentTag($parentTagName)->load('image');

            // Récupérer les recettes avec le tag direct sans parent
            $directTag = Tag::where('tag_name', $parentTagName)->whereNull('parent_tag_id')->first();
            $recipesWithDirectTag = [];
            if ($directTag) {
                $recipesWithDirectTag = $directTag->recipes()->with('image')->get();
            }

            // Combiner les deux ensembles de recettes
            $recipes = $recipesWithParentTag->merge($recipesWithDirectTag);

            return response()->json(['recipes' => $recipes]);
        } else {
            return response()->json(['message' => 'Aucun tag parent trouvé pour ce nom']);
        }
    }

    public function getImagePathForAllRecipe($recipeId): \Illuminate\Http\JsonResponse
    {
        $recipe = Recipe::with('image')->find($recipeId);

        if ($recipe) {
            $imagePath = $recipe->image;
            return response()->json(['imageInfo' => $imagePath]);
        } else {
            return response()->json(['message' => 'Recette non trouvée']);
        }
    }

    public function uploadImage(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $uploadedFile = $request->file('image');
        $uploadedFileName = time() . '_' . $uploadedFile->getClientOriginalName();

        // Enregistrer l'image dans le stockage public
        $path = $uploadedFile->storeAs('public/uploads', $uploadedFileName);

        // Créer une entrée dans la table 'images'
        $image = Image::create([
            'url' => Storage::url($path), // Récupérer l'URL pour afficher l'image
            'image_path' => $path, // Stocker le chemin relatif
        ]);

        return response()->json(['image_id' => $image->id], 200);
    }


}
