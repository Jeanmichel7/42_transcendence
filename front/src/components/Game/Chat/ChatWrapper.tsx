import { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import ConversationGame from './ConvGame';

interface ChatWrapperProps {
  socket: Socket;
  isSpectator: boolean;
  gameIdSpectator: string | undefined;
  currentPage: string;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWrapper = ({
  socket,
  isSpectator,
  gameIdSpectator,
  currentPage,
  setChatOpen,
}: ChatWrapperProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let gameId = queryParams.get('gameId') || 'lobby';
  if (gameIdSpectator) gameId = gameIdSpectator;
  const chatRoomType = currentPage === 'searchOpponent' ? 'lobby' : currentPage;

  return (
    <div className="h-full">
      <ConversationGame
        key={currentPage}
        gameId={gameId}
        socket={socket}
        type={chatRoomType}
        isSpectator={isSpectator}
        setChatOpen={setChatOpen}
      />
    </div>
  );
};

export default ChatWrapper;
