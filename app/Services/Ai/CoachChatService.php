<?php

namespace App\Services\Ai;

use App\Models\User;
use Carbon\Carbon;
use RuntimeException;
use Throwable;

class CoachChatService
{
    public function __construct(
        private readonly OpenAiClientService $openAiClient,
        private readonly UserProfilePromptBuilder $profilePromptBuilder,
        private readonly PromptTemplateService $promptTemplateService,
    ) {
    }

    public function respondFromMessages(User $user, array $messages): array
    {
        $contextSnapshot = $this->buildContextSnapshot($user);
        $normalizedMessages = $this->normalizeMessages($messages);
        $latestUserMessage = $this->extractLatestUserMessage($normalizedMessages);

        try {
            $systemPrompt = $this->promptTemplateService->load('ai/chat.system.txt');
            $userPrompt = $this->promptTemplateService->render('ai/chat.user.txt', [
                'profile_context' => $this->profilePromptBuilder->build($user),
                'context_snapshot' => json_encode($contextSnapshot, JSON_UNESCAPED_SLASHES),
                'conversation_history' => $this->formatConversationHistory($normalizedMessages),
                'user_message' => trim($latestUserMessage),
            ]);

            $payload = $this->openAiClient->chatJson($systemPrompt, $userPrompt);

            return [
                'text' => $this->extractReplyText($payload),
                'proposal' => $this->extractProposal($payload),
                'focusAreas' => $this->extractFocusAreas($payload),
                'context' => $contextSnapshot,
            ];
        } catch (Throwable) {
            return [
                'text' => $this->fallbackReply($contextSnapshot),
                'proposal' => null,
                'focusAreas' => $this->fallbackFocusAreas($contextSnapshot),
                'context' => $contextSnapshot,
            ];
        }
    }

    private function normalizeMessages(array $messages): array
    {
        $normalized = [];

        foreach ($messages as $message) {
            if (!is_array($message)) {
                continue;
            }

            $sender = $message['sender'] ?? null;
            $text = $message['text'] ?? null;

            if (!is_string($sender) || !in_array($sender, ['user', 'ai'], true)) {
                continue;
            }

            if (!is_string($text) || trim($text) === '') {
                continue;
            }

            $normalized[] = [
                'sender' => $sender,
                'text' => trim($text),
            ];
        }

        return $normalized;
    }

    private function extractLatestUserMessage(array $messages): string
    {
        for ($index = count($messages) - 1; $index >= 0; $index--) {
            if (($messages[$index]['sender'] ?? null) === 'user' && is_string($messages[$index]['text'] ?? null)) {
                return (string) $messages[$index]['text'];
            }
        }

        return '';
    }

    public function buildContextSnapshot(User $user): array
    {
        $today = Carbon::now()->englishDayOfWeek;
        $dailyLog = $user->dailyLogs()->latest()->first();
        $recommendation = $dailyLog?->recommendation;
        $recentLogs = $user->dailyLogs()->latest()->limit(3)->get();

        $weeklyPlan = $user->weeklyPlan?->plan_json;
        $nutritionPlan = $user->nutritionPlan?->nutrition_json;
        $acceptedWorkout = is_array($weeklyPlan['planned_workout'] ?? null) ? $weeklyPlan['planned_workout'] : null;
        $acceptedNutrition = is_array($weeklyPlan['planned_nutrition'] ?? null) ? $weeklyPlan['planned_nutrition'] : null;

        $dayFocus = $this->resolveDayFocus($weeklyPlan, $today);
        $plannedSession = $this->resolvePlannedSession($acceptedWorkout, $recommendation, $dayFocus);
        $nutritionTargetCalories = $this->resolveNutritionTargetCalories($acceptedNutrition, $nutritionPlan);
        $nutritionTip = $this->resolveNutritionTip($acceptedNutrition, $nutritionPlan, $recommendation);

        return [
            'userName' => (string) ($user->name ?: 'Athlete'),
            'goal' => (string) ($user->goal ?: 'maintain'),
            'fitnessGoal' => (string) ($user->fitness_goal ?: 'unspecified'),
            'activityLevel' => (string) ($user->activity_level ?: 'unspecified'),
            'today' => [
                'day' => $today,
                'plannedSession' => $plannedSession,
                'adjustedSession' => is_string($acceptedWorkout['adjusted'] ?? null) && trim($acceptedWorkout['adjusted']) !== ''
                    ? $acceptedWorkout['adjusted']
                    : $recommendation?->adjusted,
                'readinessScore' => $recommendation?->readiness_score,
                'sleepHours' => $dailyLog ? (float) $dailyLog->sleep_hours : null,
                'stressLevel' => $dailyLog ? (int) $dailyLog->stress_level : null,
                'soreness' => $dailyLog ? (int) $dailyLog->soreness : null,
            ],
            'nutrition' => [
                'targetCalories' => $nutritionTargetCalories,
                'hydrationLiters' => is_numeric($nutritionPlan['hydrationLiters'] ?? null) ? (float) $nutritionPlan['hydrationLiters'] : null,
                'proteinGrams' => is_numeric($acceptedNutrition['proteinGrams'] ?? $nutritionPlan['macroTargets']['proteinGrams'] ?? null) ? (int) ($acceptedNutrition['proteinGrams'] ?? $nutritionPlan['macroTargets']['proteinGrams']) : null,
                'carbsGrams' => is_numeric($acceptedNutrition['carbsGrams'] ?? $nutritionPlan['macroTargets']['carbsGrams'] ?? null) ? (int) ($acceptedNutrition['carbsGrams'] ?? $nutritionPlan['macroTargets']['carbsGrams']) : null,
                'fatGrams' => is_numeric($acceptedNutrition['fatGrams'] ?? $nutritionPlan['macroTargets']['fatGrams'] ?? null) ? (int) ($acceptedNutrition['fatGrams'] ?? $nutritionPlan['macroTargets']['fatGrams']) : null,
                'nutritionTip' => $nutritionTip,
            ],
            'mentalWellbeing' => [
                'coachingFocus' => $this->resolveCoachingFocus(
                    $dailyLog ? (int) $dailyLog->stress_level : null,
                    $recommendation?->readiness_score,
                    $this->hasRecurringRecoveryIssue($recentLogs),
                ),
                'recoveryReminder' => $this->resolveRecoveryReminder(
                    $dailyLog ? (float) $dailyLog->sleep_hours : null,
                    $this->hasRecurringRecoveryIssue($recentLogs),
                ),
            ],
        ];
    }

    private function formatConversationHistory(array $history): string
    {
        if ($history === []) {
            return 'No previous messages.';
        }

        $lines = [];

        foreach (array_slice($history, -8) as $item) {
            if (!is_array($item)) {
                continue;
            }

            $sender = ($item['sender'] ?? '') === 'ai' ? 'coach' : 'user';
            $text = is_string($item['text'] ?? null) ? trim($item['text']) : '';

            if ($text === '') {
                continue;
            }

            $lines[] = sprintf('%s: %s', $sender, preg_replace('/\s+/', ' ', $text) ?? $text);
        }

        return $lines !== [] ? implode("\n", $lines) : 'No previous messages.';
    }

    private function resolveDayFocus(mixed $weeklyPlan, string $day): string
    {
        if (!is_array($weeklyPlan) || !is_array($weeklyPlan['days'] ?? null)) {
            return 'Recovery-aware full body training';
        }

        foreach ($weeklyPlan['days'] as $entry) {
            if (!is_array($entry)) {
                continue;
            }

            if (($entry['day'] ?? null) === $day && is_string($entry['focus'] ?? null) && trim($entry['focus']) !== '') {
                return $entry['focus'];
            }
        }

        return 'Recovery-aware full body training';
    }

    private function resolvePlannedSession(mixed $acceptedWorkout, ?object $recommendation, string $dayFocus): string
    {
        if (is_array($acceptedWorkout)) {
            foreach (['summary', 'focus', 'adjusted'] as $key) {
                if (is_string($acceptedWorkout[$key] ?? null) && trim($acceptedWorkout[$key]) !== '') {
                    return $acceptedWorkout[$key];
                }
            }
        }

        if ($recommendation?->planned && is_string($recommendation->planned) && trim($recommendation->planned) !== '') {
            return $recommendation->planned;
        }

        return $dayFocus;
    }

    private function resolveNutritionTargetCalories(mixed $acceptedNutrition, mixed $nutritionPlan): ?int
    {
        if (is_array($acceptedNutrition)) {
            foreach (['calories', 'targetCalories'] as $key) {
                if (is_numeric($acceptedNutrition[$key] ?? null)) {
                    return (int) $acceptedNutrition[$key];
                }
            }
        }

        if (is_array($nutritionPlan) && is_numeric($nutritionPlan['targetCalories'] ?? null)) {
            return (int) $nutritionPlan['targetCalories'];
        }

        return null;
    }

    private function resolveNutritionTip(mixed $acceptedNutrition, mixed $nutritionPlan, ?object $recommendation): ?string
    {
        if (is_array($acceptedNutrition) && is_string($acceptedNutrition['summary'] ?? null) && trim($acceptedNutrition['summary']) !== '') {
            return $acceptedNutrition['summary'];
        }

        if (is_array($nutritionPlan) && is_string($nutritionPlan['nutritionTip'] ?? null)) {
            return $nutritionPlan['nutritionTip'];
        }

        if ($recommendation?->nutrition_tip && is_string($recommendation->nutrition_tip)) {
            return $recommendation->nutrition_tip;
        }

        return null;
    }

    private function extractReplyText(array $payload): string
    {
        $reply = is_string($payload['text'] ?? null) ? trim($payload['text']) : '';

        if ($reply === '') {
            $reply = is_string($payload['reply'] ?? null) ? trim($payload['reply']) : '';
        }

        if ($reply === '') {
            throw new RuntimeException('Coach chat text is empty.');
        }

        return $reply;
    }

    private function extractProposal(array $payload): ?array
    {
        $proposal = $payload['proposal'] ?? null;

        if ($proposal === null) {
            return null;
        }

        if (!is_array($proposal)) {
            throw new RuntimeException('Coach chat proposal is invalid.');
        }

        if (!in_array($proposal['type'] ?? null, ['nutrition', 'workout'], true)) {
            throw new RuntimeException('Coach chat proposal type is invalid.');
        }

        if (!is_array($proposal['data'] ?? null)) {
            throw new RuntimeException('Coach chat proposal data is invalid.');
        }

        return [
            'type' => $proposal['type'],
            'data' => $proposal['data'],
        ];
    }

    private function extractFocusAreas(array $payload): array
    {
        $areas = $payload['focusAreas'] ?? [];

        if (!is_array($areas)) {
            return [];
        }

        $normalized = [];

        foreach ($areas as $area) {
            if (!is_string($area) || trim($area) === '') {
                continue;
            }

            $normalized[] = $area;
        }

        return array_values(array_slice($normalized, 0, 3));
    }

    private function fallbackReply(array $contextSnapshot): string
    {
        $readiness = $contextSnapshot['today']['readinessScore'] ?? null;
        $stress = $contextSnapshot['today']['stressLevel'] ?? null;

        if (is_int($readiness) && $readiness < 50) {
            return 'I am with you. Today we will keep the session lighter, focused on technique, mobility, and recovery so we can protect your body and your mind.';
        }

        if (is_int($stress) && $stress >= 7) {
            return 'Lets take it step by step. Before pushing hard, pause for a short breathing reset and then do a controlled session to lower mental and physical load.';
        }

        return 'I am with you on this. You can move forward today with a quality session, good hydration, and a short mental decompression routine at the end.';
    }

    private function fallbackFocusAreas(array $contextSnapshot): array
    {
        $areas = ['training', 'nutrition', 'mental-recovery'];

        if (($contextSnapshot['today']['readinessScore'] ?? 100) < 60) {
            $areas = ['recovery', 'hydration', 'stress-management'];
        }

        return $areas;
    }

    private function resolveCoachingFocus(?int $stressLevel, ?int $readinessScore, bool $needsMedicalAttention = false): string
    {
        if ($needsMedicalAttention) {
            return 'You have had several rough recovery days in a row. Consider a medical or physio consultation to review what is going on.';
        }

        if (is_int($stressLevel) && $stressLevel >= 7) {
            return 'Lower stress load first, then train with controlled effort.';
        }

        if (is_int($readinessScore) && $readinessScore < 50) {
            return 'Protect recovery and keep momentum with lighter, high-quality work.';
        }

        return 'Build consistency with quality reps and calm execution.';
    }

    private function resolveRecoveryReminder(?float $sleepHours, bool $needsMedicalAttention = false): string
    {
        if ($needsMedicalAttention) {
            return 'Your recent recovery pattern looks rough; if this keeps happening, book a doctor or physio visit for a proper check.';
        }

        if ($sleepHours !== null && $sleepHours < 7.0) {
            return 'Prioritize sleep extension tonight and reduce unnecessary intensity today.';
        }

        return 'Keep hydration, post-workout nutrition, and a short decompression routine today.';
    }

    private function hasRecurringRecoveryIssue($recentLogs): bool
    {
        if (!method_exists($recentLogs, 'count') || $recentLogs->count() < 3) {
            return false;
        }

        $badSignals = 0;

        foreach ($recentLogs as $log) {
            if (!is_object($log)) {
                continue;
            }

            $sleepHours = is_numeric($log->sleep_hours ?? null) ? (float) $log->sleep_hours : null;
            $stressLevel = is_numeric($log->stress_level ?? null) ? (int) $log->stress_level : null;
            $soreness = is_numeric($log->soreness ?? null) ? (int) $log->soreness : null;

            if (($sleepHours !== null && $sleepHours < 6.5) || ($stressLevel !== null && $stressLevel >= 7) || ($soreness !== null && $soreness >= 7)) {
                $badSignals++;
            }
        }

        return $badSignals >= 3;
    }
}
