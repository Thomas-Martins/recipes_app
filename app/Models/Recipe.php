<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'recipes';

    protected $fillable = [
        'recipe_name',
        'description',
        'cooking_time',
        'break_time',
        'preparation_time',
        'recipe_portion',
        'unit_portion',
        'id_tag',
        'id_user',
        'id_difficulty',
    ];
    public $timestamps= false;
}
