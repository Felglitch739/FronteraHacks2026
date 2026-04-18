<?php

namespace App\Services\WeeklyPlans;

use App\Models\User;
use App\Models\WeeklyPlan;
use App\Services\Ai\OpenAiClientService;
use Throwable;

class WeeklyPlanService
{
    public function __construct(
        private readonly OpenAiClientService $openAiClient,
        private readonly WeeklyPlanTemplateService $templateService,
    ) {
    }

    public function generateMock(string $goal): array
    {
        return $this->templateService->build($goal);
    }

    public function generateUsingAiOrFallback(string $goal): array
    {
        try {
            $result = $this->generateUsingAi($goal);

            return $this->normalize($result, $goal);
        } catch (Throwable) {
            return $this->templateService->build($goal);
        }
    }

    public function saveForUser(User $user, array $planPayload): WeeklyPlan
    {
        return WeeklyPlan::query()->updateOrCreate(
            ['user_id' => $user->id],
            ['plan_json' => $planPayload],
        );
    }

    public function getForUser(User $user): ?WeeklyPlan
    {
        return $user->weeklyPlan()->first();
    }

    private function generateUsingAi(string $goal): array
    {
        $systemPrompt = <<<PROMPT
You are an expert sports training planner.
Return only valid JSON.
Create a 7-day weekly plan for a user with a fitness goal.
Use this exact shape:
{
  "goal": "bulk|cut|maintain",
  "days": [
    {"day": "Monday", "focus": "..."}
  ],
  "notes": ["..."]
}
Rules:
- Exactly 7 day entries from Monday to Sunday.
- Keep focus concise.
- Notes must contain 2 short strings.
PROMPT;

        $userPrompt = "Generate the plan for goal: {$goal}";

        return $this->openAiClient->chatJson($systemPrompt, $userPrompt);
    }

    private function normalize(array $payload, string $goal): array
    {
        $days = $payload['days'] ?? [];

        if (!is_array($days)) {
            $days = [];
        }

        if (count($days) !== 7) {
            return $this->templateService->build($goal);
        }

        $notes = $payload['notes'] ?? [];

        if (!is_array($notes) || count($notes) < 1) {
            $notes = [
                'Prioritize warm-up and cooldown every session.',
                'Adjust intensity if readiness is low.',
            ];
        }

        return [
            'goal' => in_array(($payload['goal'] ?? ''), ['bulk', 'cut', 'maintain'], true)
                ? $payload['goal']
                : $goal,
            'days' => array_values($days),
            'notes' => array_values(array_slice($notes, 0, 2)),
        ];
    }
}
