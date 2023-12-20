<?php

namespace Tests\Unit;

use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RecipeControllerTest extends TestCase
{

    public function testCreateRecipeWithValidData()
    {
        Storage::fake('public'); // Utilisation du système de stockage de fichiers factice pour simuler les uploads

        $image = UploadedFile::fake()->image('recipe.jpg'); // Création d'une fausse image

        $data = [
            'recipe_name' => 'Nouvelle recette',
            'description' => 'Description de la nouvelle recette',
            'cooking_time' => 30,
            'break_time' => 60,
            'preparation_time' => 30,
            'recipe_portion' => 6,
            'unit_portion' => 'personnes',
            'advice' => 'Ajoutez un conseil',
            'image' => $image,
            'id_tag' => 2,
            'id_user' => 1,
            'id_difficulty' => 1,
            'id_image' => null,
            'ingredients' => [
                [
                    'ingredientId' => 1,
                    'quantity' => 100,
                    'unit' => 'gram',
                ],
            ],
        ];

        $response = $this->postJson('/api/recipes', $data);

        $response->assertStatus(200); // Vérifie que la création a réussi avec le code 200

        $this->assertDatabaseHas('recipes', ['recipe_name' => 'Nouvelle recette']); // Vérifie que la recette est dans la base de données

        $this->assertDatabaseHas('recipeHasIngredient', ['id_recipe' => Recipe::where('recipe_name', 'Nouvelle recette')->first()->id]);
    }
}
