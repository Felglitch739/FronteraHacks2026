<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Services\Ai\CoachChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request, CoachChatService $coachChatService): Response
    {
        $conversation = $this->conversationFor($request->user());

        return Inertia::render('chat', [
            'chatContext' => $coachChatService->buildContextSnapshot($request->user()),
            'chatMessages' => $conversation->messages()
                ->orderBy('id')
                ->get()
                ->map(fn(ChatMessage $message): array => $this->formatChatMessage($message))
                ->values()
                ->all(),
        ]);
    }

    public function reply(Request $request, CoachChatService $coachChatService): JsonResponse
    {
        $conversation = $this->conversationFor($request->user());
        $storedCount = $conversation->messages()->count();

        if ($request->filled('messages')) {
            $validated = $request->validate([
                'messages' => ['required', 'array', 'min:1', 'max:24'],
                'messages.*.id' => ['required', 'string'],
                'messages.*.sender' => ['required', 'string', 'in:user,ai'],
                'messages.*.text' => ['required', 'string', 'max:1200'],
                'messages.*.proposal' => ['sometimes', 'nullable', 'array'],
                'messages.*.proposal.type' => ['sometimes', 'nullable', 'in:nutrition,workout'],
                'messages.*.proposal.data' => ['sometimes', 'nullable', 'array'],
                'messages.*.proposalStatus' => ['sometimes', 'nullable', 'in:pending,accepted,rejected'],
            ]);

            $incomingMessages = $validated['messages'];
            $pendingMessages = array_slice($incomingMessages, $storedCount);

            DB::transaction(function () use ($conversation, $pendingMessages): void {
                foreach ($pendingMessages as $message) {
                    ChatMessage::query()->updateOrCreate(
                        [
                            'external_id' => (string) $message['id'],
                        ],
                        [
                            'chat_conversation_id' => $conversation->id,
                            'sender' => (string) $message['sender'],
                            'text' => (string) $message['text'],
                            'proposal_json' => $message['proposal'] ?? null,
                            'proposal_status' => $message['proposalStatus'] ?? null,
                        ],
                    );
                }
            });

            $transcript = $conversation->messages()
                ->orderBy('id')
                ->get()
                ->map(fn(ChatMessage $message): array => $this->formatChatMessage($message))
                ->values()
                ->all();

            $response = $coachChatService->respondFromMessages(
                $request->user(),
                $transcript,
            );

            $assistantMessage = ChatMessage::query()->create([
                'chat_conversation_id' => $conversation->id,
                'external_id' => (string) Str::uuid(),
                'sender' => 'ai',
                'text' => (string) ($response['text'] ?? $response['reply'] ?? ''),
                'proposal_json' => $response['proposal'] ?? null,
                'proposal_status' => isset($response['proposal']) && $response['proposal'] !== null ? 'pending' : null,
            ]);

            $response['messages'] = [
                ...$transcript,
                $this->formatChatMessage($assistantMessage),
            ];

            return response()->json($response);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1200'],
            'history' => ['sometimes', 'array', 'max:12'],
            'history.*.sender' => ['required_with:history', 'string', 'in:user,ai'],
            'history.*.text' => ['required_with:history', 'string', 'max:1200'],
        ]);

        $history = is_array($validated['history'] ?? null) ? $validated['history'] : [];

        $response = $coachChatService->respondFromMessages($request->user(), [
            ...$history,
            [
                'sender' => 'user',
                'text' => (string) $validated['message'],
            ],
        ]);

        return response()->json($response);
    }

    private function conversationFor(mixed $user): ChatConversation
    {
        $conversation = ChatConversation::query()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        if ($conversation->messages()->count() === 0) {
            ChatMessage::query()->create([
                'chat_conversation_id' => $conversation->id,
                'external_id' => (string) Str::uuid(),
                'sender' => 'ai',
                'text' => "Hi {$user->name}, I am Aura. I am here to coach your training, nutrition, and mental recovery with care. Tell me how you feel today and we will adapt your plan together.",
                'proposal_json' => null,
                'proposal_status' => null,
            ]);

            $conversation->load('messages');
        }

        return $conversation;
    }

    private function formatChatMessage(ChatMessage $message): array
    {
        return [
            'id' => $message->external_id,
            'text' => $message->text,
            'sender' => $message->sender,
            'proposal' => $message->proposal_json,
            'proposalStatus' => $message->proposal_status,
        ];
    }
}
