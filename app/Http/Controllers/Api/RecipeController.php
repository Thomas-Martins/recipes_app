<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Image;
use App\Models\Recipe;
use App\Models\Tag;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
    public function store(StoreRecipeRequest $request): \Illuminate\Http\JsonResponse
    {

        // Récupérer les données de la recette depuis le formulaire
        $recipeData = $request->validated(); // Ajoutez d'autres champs ici

        //Enregistrer l'image et récupérer l'ID de l'image
        $imageUploadResponse = $this->uploadImage($request);

//        return response()->json(['message' => 'Recipe created successfully', 'recipe' => $recipeData], 200);

        if ($imageUploadResponse->getStatusCode() === 200) {
            $imageId = $imageUploadResponse->getData()->image_id;


            // Enregistrer la recette dans la base de données
            $recipe = Recipe::create($recipeData);

            // Associer l'ID de l'image à la recette
            $recipe->id_image = $imageId;
            $recipe->save();

            return response()->json(['message' => 'Recipe created successfully', 'recipe' => $recipe], 200);
        } else {
            return response()->json(['message' => 'Failed to upload image'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Récupérer la recette par son ID
        $recipe = Recipe::with(['image', 'ingredients' => function ($query) {
            $query->select('ingredients.*', 'recipeHasIngredient.*');
        }])->find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Recette introuvable'], 404);
        }

        return response()->json($recipe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, $id): \Illuminate\Http\JsonResponse
    {
        // On valide les données de la requête puis on les stocke
        $updatedData = $request->validated();

        // On sélectionne la recette à modifier grâce à l'id
        $recipe = Recipe::findOrFail($id);

        //On mets à jour la recette avec les nouvelles données
        $updatedData = $recipe->update($updatedData);

        // Boucle pour gérer si la maj échoue
        if ($updatedData) {
            return response()->json(['message' => 'La recette à bien été mis à jour', 'Updated Recipe' => $recipe], 200);
        } else {
            return response()->json(['message' => 'Échec lors de la mise à jour'], 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe)
    {
        $deleteRecipe = $recipe->delete();
        if ($deleteRecipe) {
            return response('La recette á  bien été supprimé', 200);
        } else {
            return response('Un problème est survenue lors de la suppression', 500);
        }
    }

    /**
     * Methods for Uploading an Image when a Recipe is created
     */
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

    /**
     * Methods for filter recipes list by a certain tag
     */
    public function getRecipesByParentTag($parentTag): \Illuminate\Http\JsonResponse
    {
        // Recherche du tag parent dans la base de données
        $tag = Tag::where('tag_name', $parentTag)->first();

        if ($tag) {
            // Récupérer les recettes associées au tag parent
            $recipesWithParentTag = $tag->recipesByParentTag($parentTag)->load('image');

            // Récupérer les recettes associées au tag directement sans parent
            $directTag = Tag::where('tag_name', $parentTag)->whereNull('parent_tag_id')->first();
            $recipesWithDirectTag = [];
            if ($directTag) {
                $recipesWithDirectTag = $directTag->recipes()->with('image')->get();
            }

            // Fusionner les ensembles de recettes obtenus
            $recipes = $recipesWithParentTag->merge($recipesWithDirectTag);

            return response()->json(['recipes' => $recipes]);
        } else {
            // Retourner un message si aucun tag parent correspondant n'est trouvé
            return response()->json(['message' => 'Aucun tag parent trouvé pour ce nom']);
        }
    }

    /**
     * Methods for filter recipes list by a certain userID
     */
    public function getUserRecipes(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $userRecipes = Recipe::where('id_user', $user->id)->get();

        return response()->json($userRecipes);
    }

}
