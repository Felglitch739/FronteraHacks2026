import { Head } from '@inertiajs/react';
import Chat from '@/components/fitness/Chat';
import type {
    ChatContextViewModel,
    ChatMessageViewModel,
} from '@/types/fitness';

type ChatPageProps = {
    chatContext: ChatContextViewModel;
    chatMessages?: ChatMessageViewModel[];
};

export default function ChatPage({
    chatContext,
    chatMessages = [],
}: ChatPageProps) {
    return (
        <>
            <Head title="Chat" />
            <Chat context={chatContext} initialMessages={chatMessages} />
        </>
    );
}
