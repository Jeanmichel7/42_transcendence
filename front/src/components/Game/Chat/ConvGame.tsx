import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

// import { CircularProgress } from '@mui/material';
import FormPriveGameConv from './ChatForm';
import MessageCardChatGame, { MessageInterfaceTmp } from './MsgCard';

interface ConversationGameProps {
  gameId: string;
  socket: Socket;
  type: string;
  isSpectator: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationGame = ({
  gameId,
  socket,
  type,
  isSpectator,
  setChatOpen,
}: ConversationGameProps) => {
  const [messages, setMessages] = useState<MessageInterfaceTmp[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  useEffect(() => {
    try {
      socket.emit('joinChatGame', {
        gameId: gameId,
        type: type,
      });

      socket.on('message', (data: MessageInterfaceTmp) => {
        setMessages(prev => [...prev, data]);
        setChatOpen(true);
        setShouldScrollToBottom(true);
      });
    } catch (e) {
      // console.warn('error: ', e);
    }
    return () => {
      try {
        socket.off('message');
        socket.emit('leaveChatGame', {
          gameId: gameId,
          type: type,
        });
      } catch (e) {
        // console.warn('error: ', e);
      }
    };
  }, [socket, gameId, type, isSpectator, location]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full justify-between">
      <h3 className="font-bold text-center text-xl py-2 mr-4 border-b-2 border-blue-300">
        {type} chat
      </h3>
      <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
        {messages && (
          <div className="text-lg text-gray-100 m-1 p-2 ml-0 pl-0">
            <div className="pb-6">
              {messages.map((msg, i) => (
                <MessageCardChatGame key={i} data={msg} />
              ))}
            </div>

            <div className="sticky bottom-0 pr-1 pb-1">
              <FormPriveGameConv
                socket={socket}
                gameId={gameId}
                type={type}
                setShouldScrollToBottom={setShouldScrollToBottom}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default ConversationGame;
