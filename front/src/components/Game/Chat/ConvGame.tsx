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

  useEffect(() => {
    try {
      socket.emit('joinChatGame', {
        gameId: gameId,
        type: type,
      });

      socket.on('message', (data: MessageInterfaceTmp) => {
        setMessages(prev => [...prev, data]);
        setChatOpen(true);
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

  return (
    <div className="flex flex-col h-full justify-between">
      <h3 className="font-bold text-center text-xl py-2">{type} chat</h3>
      <div className="flex-grow border-t-[1px] border-gray-100 mr-5"></div>
      <div className="overflow-y-auto ">
        {messages &&
          messages.map((msg, i) => <MessageCardChatGame key={i} data={msg} />)}
        <div ref={bottomRef}></div>
      </div>

      <FormPriveGameConv socket={socket} gameId={gameId} type={type} />
    </div>
  );
};

export default ConversationGame;
