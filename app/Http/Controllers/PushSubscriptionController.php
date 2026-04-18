<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000'],
            'keys.p256dh' => ['required', 'string', 'max:1000'],
            'keys.auth' => ['required', 'string', 'max:1000'],
            'contentEncoding' => ['nullable', 'string', 'max:100'],
        ]);

        $subscription = PushSubscription::query()->updateOrCreate(
            ['endpoint' => $payload['endpoint']],
            [
                'user_id' => $request->user()->id,
                'public_key' => $payload['keys']['p256dh'],
                'auth_token' => $payload['keys']['auth'],
                'content_encoding' => $payload['contentEncoding'] ?? null,
            ],
        );

        return response()->json([
            'ok' => true,
            'id' => $subscription->id,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000'],
        ]);

        PushSubscription::query()
            ->where('user_id', $request->user()->id)
            ->where('endpoint', $payload['endpoint'])
            ->delete();

        return response()->json(['ok' => true]);
    }
}
