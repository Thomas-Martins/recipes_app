<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tags';

    public function recipes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Recipe::class, 'id_tag');
    }

    public function parentTag(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tag::class, 'parent_tag_id');
    }

    public function recipesByParentTag($parentTagName)
    {
        return Recipe::whereHas('tag', function ($query) use ($parentTagName) {
            $query->where('parent_tag_id', function ($subQuery) use ($parentTagName) {
                $subQuery->select('id')->from('tags')->where('tag_name', $parentTagName);
            });
        })->get();
    }


}
