import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './Interface';
import { GameData } from './Interface';

const useSocketConnectionSpectator = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  gameId: bigint
) => {
  const [data, setData] = useState<GameData | undefined>();

  useEffect(() => {
    console.log('spectateGame', gameId);
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
