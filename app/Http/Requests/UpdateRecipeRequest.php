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
            'cooking_time' => 'integer|min:0',
            'break_time' => 'integer|min:0',
            'preparation_time' => 'integer|min:0',
            'recipe_portion' => 'integer|min:1',
            'unit_portion' => 'string',
            'id_tag' => 'integer|exists:tags,id',
            'id_user' => 'integer|exists:users,id',
            'id_difficulty' => 'integer|exists:difficulties,id',
        ];
    }
}
