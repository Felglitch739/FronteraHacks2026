<?php

namespace App\Services\Notifications;

use App\Models\PushSubscription;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class WebPushNotificationService
{
    /**
     * @param iterable<int, PushSubscription> $subscriptions
     * @return array{attempted:int,successful:int,failed:int,expired:int}
     */
    public function send(iterable $subscriptions, string $title, string $body, array $data = []): array
    {
        $publicKey = (string) config('webpush.vapid.public_key');
        $privateKey = (string) config('webpush.vapid.private_key');
        $subject = (string) config('webpush.vapid.subject');

        if ($publicKey === '' || $privateKey === '') {
            throw new \RuntimeException('Missing WEBPUSH_VAPID_PUBLIC_KEY or WEBPUSH_VAPID_PRIVATE_KEY.');
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => $subject,
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ],
        ]);

        $payload = json_encode([
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ], JSON_THROW_ON_ERROR);

        $attempted = 0;

        foreach ($subscriptions as $subscription) {
            $attempted++;

            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'publicKey' => $subscription->public_key,
                    'authToken' => $subscription->auth_token,
                    'contentEncoding' => $subscription->content_encoding ?: 'aesgcm',
                ]),
                $payload,
            );
        }

        $successful = 0;
        $failed = 0;
        $expired = 0;

        foreach ($webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $successful++;
                continue;
            }

            $failed++;

            if ($report->isSubscriptionExpired()) {
                $expired++;
                PushSubscription::query()
                    ->where('endpoint', $report->getEndpoint())
                    ->delete();
            }
        }

        return [
            'attempted' => $attempted,
            'successful' => $successful,
            'failed' => $failed,
            'expired' => $expired,
        ];
    }
}
