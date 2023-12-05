<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'recipe_name' => $this->recipe_name,
            'description' => $this->description,
            'cooking_time' => $this->cooking_time,
            'break_time' => $this->break_time,
            'preparation_time' => $this->preparation_time,
            'recipe_portion' => $this->recipe_portion,
            'unit_portion' => $this->unit_portion,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'advice' => $this->advice,
            'id_tag' => $this->id_tag,
            'id_user' => $this->id_user,
            'id_difficulty' => $this->id_difficulty,
        ];
    }
}
