<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'recipe_name'=>'string',
            'description' => 'string',
            'cooking_time' => 'integer',
            'break_time' => 'integer',
            'preparation_time' => 'integer',
            'recipe_portion' => 'integer',
            'unit_portion' => 'string',
            'id_difficulty' => 'integer',
            'advice' => 'string',
        ];
    }
}
