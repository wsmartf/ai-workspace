import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
    message: { role: string; content: string };
    index: number;
    onShowContextMenu: (x: number, y: number, index: number) => void;
    isSelected: boolean;
}

export default function MessageItem({
    message,
    index,
    onShowContextMenu,
    isSelected,
}: MessageItemProps) {
    const isUser = message.role === 'user';

    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                onShowContextMenu(e.clientX, e.clientY, index);
            }}
            className={`w-full flex px-4 py-1 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`
                    ${isUser ? 'w-3/4 bg-gray-100 border' : 'w-full'}
                    ${isSelected ? 'bg-gray-200' : ''}
                    p-3 rounded-md
                    `}
            >
                <div className="flex justify-between">
                    <div>
                        <div className="text-xs text-gray-500 mb-1 font-semibold">
                            {isUser ? 'You' : 'Agent'}
                        </div>
                        <div className="prose prose-sm max-w-full">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
