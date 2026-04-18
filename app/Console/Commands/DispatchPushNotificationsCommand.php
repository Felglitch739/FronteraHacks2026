<?php

namespace App\Console\Commands;

use App\Models\PushSubscription;
use App\Services\Notifications\WebPushNotificationService;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class DispatchPushNotificationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'push:dispatch
                            {type : daily|smart|workout}
                            {--user=* : Restrict to specific user IDs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch web push notifications to users';

    public function handle(WebPushNotificationService $webPush): int
    {
        $type = strtolower((string) $this->argument('type'));
        $userIds = collect((array) $this->option('user'))
            ->filter(fn($value) => is_numeric($value))
            ->map(fn($value) => (int) $value)
            ->values();

        $templates = [
            'daily' => [
                'title' => 'Daily Reminder',
                'body' => 'Time to do your check-in',
                'url' => '/check-in',
            ],
            'smart' => [
                'title' => 'Smart Reminder',
                'body' => "We haven't seen you today. How are you feeling?",
                'url' => '/check-in',
            ],
            'workout' => [
                'title' => 'Workout Ready',
                'body' => 'Your personalized workout is ready',
                'url' => '/dashboard',
            ],
        ];

        if (!isset($templates[$type])) {
            $this->error('Invalid type. Use one of: daily, smart, workout.');

            return self::INVALID;
        }

        $query = PushSubscription::query()->with('user');

        if ($userIds->isNotEmpty()) {
            $query->whereIn('user_id', $userIds->all());
        }

        if ($type === 'smart') {
            $today = CarbonImmutable::today();
            $query->whereHas('user', function ($userQuery) use ($today) {
                $userQuery->whereDoesntHave('dailyLogs', function ($dailyLogQuery) use ($today) {
                    $dailyLogQuery->whereDate('created_at', $today);
                });
            });
        }

        $subscriptions = $query->get();

        if ($subscriptions->isEmpty()) {
            $this->warn('No matching push subscriptions found.');

            return self::SUCCESS;
        }

        $template = $templates[$type];

        $stats = $webPush->send(
            subscriptions: $subscriptions,
            title: $template['title'],
            body: $template['body'],
            data: [
                'type' => $type,
                'url' => $template['url'],
                'sent_at' => now()->toIso8601String(),
            ],
        );

        $this->table(
            ['Type', 'Subscriptions', 'Delivered', 'Failed', 'Expired removed'],
            [
                [
                    $type,
                    (string) $stats['attempted'],
                    (string) $stats['successful'],
                    (string) $stats['failed'],
                    (string) $stats['expired'],
                ]
            ],
        );

        return self::SUCCESS;
    }
}
