<?php

namespace App\Services\WeeklyPlans;

class WeeklyPlanTemplateService
{
    public function build(string $goal): array
    {
        $goal = in_array($goal, ['bulk', 'cut', 'maintain'], true) ? $goal : 'maintain';

        return [
            'goal' => $goal,
            'days' => [
                ['day' => 'Monday', 'focus' => $goal === 'cut' ? 'HIIT + Core' : 'Upper Body Strength'],
                ['day' => 'Tuesday', 'focus' => 'Lower Body Strength'],
                ['day' => 'Wednesday', 'focus' => 'Active Recovery'],
                ['day' => 'Thursday', 'focus' => $goal === 'bulk' ? 'Push Hypertrophy' : 'Full Body Strength'],
                ['day' => 'Friday', 'focus' => $goal === 'cut' ? 'Conditioning + Core' : 'Pull Hypertrophy'],
                ['day' => 'Saturday', 'focus' => 'Mobility + Cardio'],
                ['day' => 'Sunday', 'focus' => 'Rest'],
            ],
            'notes' => [
                'Prioritize warm-up and cooldown every session.',
                'Adjust intensity if readiness is low.',
            ],
        ];
    }
}
