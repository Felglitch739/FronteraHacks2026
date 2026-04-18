<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\ChatConversation;

#[Fillable(['chat_conversation_id', 'external_id', 'sender', 'text', 'proposal_json', 'proposal_status'])]
class ChatMessage extends Model
{
    protected function casts(): array
    {
        return [
            'proposal_json' => 'array',
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ChatConversation::class, 'chat_conversation_id');
    }
}
