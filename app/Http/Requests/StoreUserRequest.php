<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'username' => 'required|string|max:50',
            'email' => 'required|email',
            'password' => [
                'required',
               'confirmed',
               Password::min(12)
               ->letters()
               ->symbols()
            ],
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
        ];
    }
}
