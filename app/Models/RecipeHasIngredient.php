<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeHasIngredient extends Model
{
    use HasFactory;
    protected $table = 'recipeHasIngredients';
    protected $fillable = ['id_recipe', 'id_ingredient'];

    public function ingredient(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Ingredient::class, 'id_ingredient');
    }

    public function recipe(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Recipe::class, 'id_recipe');
    }
}
