<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $table = 'ingredients';
    public $timestamps= false;

    public function recipes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'recipeHasIngredient', 'id_ingredient', 'id_recipe');
    }
}
