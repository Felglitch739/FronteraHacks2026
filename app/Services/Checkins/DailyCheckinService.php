<?php

namespace App\Services\Checkins;

use App\Models\DailyLog;

class DailyCheckinService
{
    public function createDailyLog(array $payload): DailyLog
    {
        return DailyLog::query()->create([
            'user_id' => $payload['user_id'],
            'sleep_hours' => $payload['sleep_hours'],
            'stress_level' => $payload['stress_level'],
            'soreness' => $payload['soreness'],
        ]);
    }

    public function buildMockResponse(DailyLog $dailyLog): array
    {
        return [
            'readiness_score' => 74,
            'message' => 'You are in a good spot to train today. Keep your effort controlled and focus on consistency.',
            'planned' => 'Moderate full-body strength session',
            'adjusted' => 'Slightly reduced volume with extra mobility work',
            'workout_json' => [
                'title' => 'Smart Training Session',
                'summary' => 'Prioritize quality reps and controlled tempo.',
                'exercises' => [
                    ['name' => 'Goblet Squat', 'sets' => 3, 'reps' => '10'],
                    ['name' => 'Push-Up', 'sets' => 3, 'reps' => '8-12'],
                    ['name' => 'Band Row', 'sets' => 3, 'reps' => '12'],
                ],
            ],
            'nutrition_tip' => 'Add a balanced post-workout meal with protein and complex carbs.',
            'daily_log_id' => $dailyLog->id,
        ];
    }
}
