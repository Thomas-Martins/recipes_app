<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeHasIngredientResource extends JsonResource
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
            'id_ingredient' => $this->id_ingredient,
            'id_recipe' => $this->id_recipe,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
        ];
    }
}
