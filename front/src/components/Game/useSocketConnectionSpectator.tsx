import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  GameData,
} from './Interface';

const useSocketConnectionSpectator = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  gameId: number,
) => {
  const [data, setData] = useState<GameData | undefined>();

  useEffect(() => {
    socket.emit('spectateGame', gameId);
    socket.on('gameUpdate', (serverData: GameData) => {
      setData(serverData);
    });
    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  return { gameData: data };
};

export default useSocketConnectionSpectator;
