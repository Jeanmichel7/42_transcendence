import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  GameData,
  BonusPosition,
} from './Interface';
import { GROUND_MAX_SIZE, PlayersInfo } from './Game';
import { useLocation, useNavigate } from 'react-router-dom';

const useSocketConnection = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  keyStateRef: RefObject<{
    ArrowUp: boolean;
    ArrowDown: boolean;
    ' ': boolean;
  }>,
  posRacket: RefObject<{ left: number; right: number }>,
  gameId: MutableRefObject<number>,
  scorePlayers: RefObject<{ left: number; right: number }>,
  bonusPositionRef: MutableRefObject<BonusPosition | undefined>,
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  bonusIsLoading: MutableRefObject<boolean>,
  bonusValueRef: MutableRefObject<string | undefined>,
  racketHeightRef: RefObject<{ left: number; right: number }>,
  laser: RefObject<{ left: boolean; right: boolean }>,
  playersInfo: PlayersInfo | undefined,
  setPlayerInfo: Dispatch<SetStateAction<PlayersInfo | undefined>>,
) => {
  const data = useRef<GameData | undefined>();
  const location = useLocation();
  const navigate = useNavigate();

  function normalizeGameData(serverData: GameData) {
    data.current = serverData;
    if (data.current!.isPlayerRight === true) {
      if (!playersInfo)
        setPlayerInfo({
          playerLeftUsername: data.current.player2Username,
          playerLeftAvatar: data.current.player2Avatar,
          playerRightUsername: data.current.player1Username,
          playerRightAvatar: data.current.player1Avatar,
        });
      data.current!.ball.x = GROUND_MAX_SIZE - serverData.ball.x;
      data.current!.ball.vx = -serverData.ball.vx;
      posRacket.current!.right = serverData.racketLeft;
      scorePlayers.current!.right = serverData.player1Score;
      scorePlayers.current!.left = serverData.player2Score;

      racketHeightRef.current!.left = serverData.racketRightHeight;
      racketHeightRef.current!.right = serverData.racketLeftHeight;
      if (serverData.bonus) {
        bonusPositionRef.current = serverData.bonus;
        bonusPositionRef.current.x = GROUND_MAX_SIZE - serverData.bonus.x;
      }
      bonusIsLoading.current = serverData.bonusPlayer2Loading;
      bonusValueRef.current = serverData.bonusPlayer2;
      laser.current!.left = serverData.player2Laser;
      laser.current!.right = serverData.player1Laser;
    } else {
      racketHeightRef.current!.left = serverData.racketLeftHeight;
      racketHeightRef.current!.right = serverData.racketRightHeight;
      scorePlayers.current!.right = serverData.player2Score;
      scorePlayers.current!.left = serverData.player1Score;
      posRacket.current!.right = serverData.racketRight;
      bonusPositionRef.current = serverData.bonus;
      bonusIsLoading.current = serverData.bonusPlayer1Loading;
      bonusValueRef.current = serverData.bonusPlayer1;
      laser.current!.right = serverData.player2Laser;
      laser.current!.left = serverData.player1Laser;
      if (!playersInfo)
        setPlayerInfo({
          playerLeftUsername: data.current.player1Username,
          playerLeftAvatar: data.current.player1Avatar,
          playerRightUsername: data.current.player2Username,
          playerRightAvatar: data.current.player2Avatar,
        });
    }
    gameId.current = serverData.gameId;
    return data.current;
  }

  useEffect(() => {
    if (!socket) return;
    const intervalId = setInterval(() => {
      socket.emit('clientUpdate', {
        posRacket: posRacket.current!.left,
        ArrowDown: keyStateRef.current!.ArrowDown,
        ArrowUp: keyStateRef.current!.ArrowUp,
        gameId: gameId.current!,
        useBonus: keyStateRef.current![' '],
      });
    }, 1000 / 60);

    socket.on('gameUpdate', (serverData: GameData) => {
      data.current = normalizeGameData(serverData);
      if (data.current?.gameStart) {
        setGameStarted(true);
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      socket.off('gameUpdate');
    };
  }, []);

  useEffect(() => {
    if (gameId && gameId.current) {
      const searchParams = new URLSearchParams(location.search);
      const gameIdInParams = searchParams.get('gameId');

      if (!gameIdInParams) {
        searchParams.set('gameId', gameId.current.toString());
        navigate(`.?gameId=${gameId.current}`, {
          replace: true,
          state: location.state,
        });
      }
    }
  }, [gameId, gameId.current]);

  return { gameData: data, gameId };
};

export default useSocketConnection;
