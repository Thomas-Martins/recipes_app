<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Image;
use App\Models\Recipe;
use App\Models\RecipeHasIngredient;
use App\Models\Tag;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        // Récupérer toutes les recettes avec leurs images associées
        $recipes = Recipe::with('image')->get();
        // Formater les données des recettes
        $recipesData = $recipes->map(function ($recipe) {
            return [
                'recipe' => $recipe,
            ];
        });
        // Retourner les recettes au format JSON
        return response()->json(['recipes' => $recipesData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request): \Illuminate\Http\JsonResponse
    {
        // Récupérer les données de la recette depuis le formulaire
        $recipeData = $request->validated();
        // Enregistrer l'image et récupérer l'ID de l'image
        $imageUploadResponse = $this->uploadImage($request);
        if ($imageUploadResponse->getStatusCode() === 200) {
            $imageId = $imageUploadResponse->getData()->image_id;
            // Enregistrer la recette dans la base de données
            $recipe = Recipe::create($recipeData);
            // Associer l'ID de l'image à la recette
            $recipe->id_image = $imageId;
            $recipe->save();
            // Récupérer les données des ingrédients envoyées depuis le formulaire
            $ingredients = $request->get('ingredients', []);
            // Associer les ingrédients à la recette dans recipeHasIngredients
            foreach ($ingredients as $ingredient) {
                RecipeHasIngredient::create([
                    'id_recipe' => $recipe->id,
                    'id_ingredient' => $ingredient['ingredientId'],
                    'quantity' => $ingredient['quantity'],
                    'unit' => $ingredient['unit'],
                ]);
            }
            return response()->json(['message' => 'Recipe created successfully', 'recipe' => $recipe], 200);
        } else {
            return response()->json(['message' => 'Failed to upload image'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): \Illuminate\Http\JsonResponse
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
        // Valider les données de la requête
        $updatedData = $request->validated();
        // Sélectionner la recette à modifier
        $recipe = Recipe::findOrFail($id);
        // Mettre à jour les champs de la recette
        $recipe->update($updatedData);
        // Récupérer les données des ingrédients envoyées depuis le formulaire
        $updatedIngredients = $request->get('ingredients', []);
        // Récupérer les ingrédients actuels de la recette
        $currentIngredients = $recipe->ingredients()->pluck('id_ingredient')->toArray();
        // Récupérer les identifiants des ingrédients dans $updatedIngredients
        $updatedIngredientIds = array_column($updatedIngredients, 'id');
        // Ajouts : Trouver les nouveaux ingrédients ajoutés
        foreach ($updatedIngredients as $ingredient) {
            $ingredientId = $ingredient['id'];
            // Si l'ingrédient n'est pas dans les ingrédients actuels, l'ajouter
            if (!in_array($ingredientId, $currentIngredients)) {
                RecipeHasIngredient::create([
                    'id_recipe' => $recipe->id,
                    'id_ingredient' => $ingredientId,
                    'quantity' => $ingredient['quantity'],
                    'unit' => $ingredient['unit'],
                ]);
            }
        }
        // Suppressions : Trouver les anciens ingrédients retirés
        foreach ($currentIngredients as $ingredientId) {
            // Si l'ingrédient actuel n'est pas dans les ingrédients mis à jour, le supprimer
            if (!in_array($ingredientId, array_column($updatedIngredients, 'id'))) {
                RecipeHasIngredient::where('id_recipe', $recipe->id)
                    ->where('id_ingredient', $ingredientId)
                    ->delete();
            }
        }
        // Mise à jour des entrées existantes pour les ingrédients restants
        foreach ($updatedIngredients as $ingredient) {
            $ingredientId = $ingredient['id']; // Récupérer l'identifiant de l'ingrédient
            // Si l'ingrédient existe toujours, mettre à jour la quantité et l'unité
            if (in_array($ingredientId, $currentIngredients)) {
                RecipeHasIngredient::where('id_recipe', $recipe->id)
                    ->where('id_ingredient', $ingredientId)
                    ->update([
                        'quantity' => $ingredient['quantity'],
                        'unit' => $ingredient['unit'],
                    ]);
            }
        }
        return response()->json(['message' => 'Recette mise à jour avec succès', 'Updated Recipe' => $recipe], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe):
    \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
    {
        // Supprimer la recette
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
        // Valider le fichier image envoyé
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
        // Récupérer les recettes d'un utilisateur spécifique
        $user = $request->user();
        $userRecipes = Recipe::where('id_user', $user->id)->get();
        return response()->json($userRecipes);
    }
}
