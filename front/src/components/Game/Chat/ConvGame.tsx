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
}

const ConversationGame = ({
  gameId,
  socket,
  type,
  isSpectator,
}: ConversationGameProps) => {
  const [messages, setMessages] = useState<MessageInterfaceTmp[]>([]);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   console.log('gameId: ', gameId);
  //   console.log('is sspectator', isSpectator);
  //   console.log('type', type);
  //   console.log('is spect', isSpectator);
  // }, [gameId, isSpectator, type]);

  useEffect(() => {
    // if (!socket || !gameId || !socket.connected) return;
    try {
      socket.emit('joinChatGame', {
        //     // userId: userData.id,
        gameId: gameId,
        type: type,
      });

      socket.on('message', (data: MessageInterfaceTmp) => {
        setMessages(prev => [...prev, data]);
      });
    } catch (e) {
      console.warn('error: ', e);
    }
    return () => {
      try {
        socket.off('message');
        // if (!socket.connected) return;
        socket.emit('leaveChatGame', {
          // userId: userData.id,
          gameId: gameId,
          type: type,
        });
      } catch (e) {
        console.warn('error: ', e);
      }
    };
  }, [socket, gameId, type, isSpectator, location]);

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
    <>
      <div className="flex flex-col h-full justify-between">
        <h3 className="font-bold text-center">{type} chat</h3>

        <div className="overflow-y-auto max-h-[calc(100vh-108px)] bg-[#efeff8]">
          {messages && (
            <>
              {messages.map((msg, i) => (
                <MessageCardChatGame key={i} data={msg} />
              ))}

              {/* display form message */}
              <div className="sticky bottom-0 bg-[#efeff8]">
                <FormPriveGameConv
                  setShouldScrollToBottom={setShouldScrollToBottom}
                  socket={socket}
                  gameId={gameId}
                  type={type}
                />
              </div>
            </>
          )}
          <div ref={bottomRef}></div>
        </div>
      </div>
    </>
  );
};

export default ConversationGame;
