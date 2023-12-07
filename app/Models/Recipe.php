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

    public function tag(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tag::class, 'id_tag');
    }

    public function image(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image');
    }

}
