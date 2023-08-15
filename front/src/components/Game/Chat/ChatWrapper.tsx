import { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import ConversationGame from './ConvGame';

interface ChatWrapperProps {
  socket: Socket;
  isSpectator: boolean;
  gameIdSpectator: string | undefined;
  currentPage: string;
}

const ChatWrapper = ({
  socket,
  isSpectator,
  gameIdSpectator,
  currentPage,
}: ChatWrapperProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let gameId = queryParams.get('gameId') || 'lobby';
  if (gameIdSpectator) gameId = gameIdSpectator;
  const chatRoomType = currentPage === 'searchOpponent' ? 'lobby' : currentPage;

  return (
    <>
      <ConversationGame
        key={currentPage}
        gameId={gameId}
        socket={socket}
        type={chatRoomType}
        isSpectator={isSpectator}
      />
    </>
  );
};

export default ChatWrapper;
