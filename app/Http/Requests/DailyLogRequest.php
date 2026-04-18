<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DailyLogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sleep_hours' => ['required', 'numeric', 'min:0', 'max:24'],
            'stress_level' => ['required', 'integer', 'min:1', 'max:10'],
            'soreness' => ['required', 'integer', 'min:1', 'max:10'],
        ];
    }
}
