<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static whereHas(string $string, \Closure $param)
 */
class Recipe extends Model
{
    use HasFactory;

    protected $table = 'recipes';

    protected $fillable = [
        'id',
        'recipe_name',
        'description',
        'cooking_time',
        'break_time',
        'preparation_time',
        'recipe_portion',
        'unit_portion',
        'advice',
        'id_tag',
        'id_user',
        'id_difficulty',
        'id_image'
    ];
    public $timestamps= false;

    public function tag(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tag::class, 'id_tag');
    }

    public function image(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image');
    }

    public function ingredients(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipeHasIngredient', 'id_recipe', 'id_ingredient');
    }
}
