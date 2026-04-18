<?php

namespace App\Services\Ai;

use App\Models\User;

class UserProfilePromptBuilder
{
    public function build(User $user): string
    {
        $profile = [
            'goal' => $user->goal ?? 'maintain',
            'activity_level' => $user->activity_level ?? 'unspecified',
            'fitness_goal' => $user->fitness_goal ?? 'unspecified',
            'workout_mode' => $user->workout_mode ?? 'generate',
            'age' => $user->age ?? 'unspecified',
            'weight_kg' => $user->weight_kg ?? 'unspecified',
            'height_cm' => $user->height_cm ?? 'unspecified',
            'sports_practiced' => $this->formatSportsPracticed($user->sports_practiced),
            'sports_other' => $user->sports_other ?: 'none',
            'onboarding_completed' => $user->onboarding_completed_at?->toDateString() ?? 'no',
            'custom_routine' => $this->formatCustomRoutine($user->onboarding_custom_routine),
        ];

        return implode("\n", [
            'User profile:',
            '- Goal: ' . $profile['goal'],
            '- Activity level: ' . $profile['activity_level'],
            '- Fitness goal: ' . $profile['fitness_goal'],
            '- Workout mode: ' . $profile['workout_mode'],
            '- Age: ' . $profile['age'],
            '- Weight (kg): ' . $profile['weight_kg'],
            '- Height (cm): ' . $profile['height_cm'],
            '- Sports practiced: ' . $profile['sports_practiced'],
            '- Other sports: ' . $profile['sports_other'],
            '- Onboarding completed: ' . $profile['onboarding_completed'],
            '- Custom routine: ' . $profile['custom_routine'],
        ]);
    }

    private function formatSportsPracticed(mixed $sportsPracticed): string
    {
        if (!is_array($sportsPracticed) || $sportsPracticed === []) {
            return 'none';
        }

        return implode(', ', array_map(
            static fn($sport) => is_string($sport) ? $sport : (string) $sport,
            $sportsPracticed,
        ));
    }

    private function formatCustomRoutine(mixed $customRoutine): string
    {
        if (!is_array($customRoutine) || $customRoutine === []) {
            return 'none';
        }

        $pairs = [];

        foreach ($customRoutine as $day => $focus) {
            if (!is_string($day) || !is_string($focus) || trim($focus) === '') {
                continue;
            }

            $pairs[] = $day . ': ' . $focus;
        }

        return $pairs !== [] ? implode('; ', $pairs) : 'none';
    }
}
