import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './Interface';
import { Socket } from 'socket.io-client';
import { GROUND_MAX_SIZE } from '../../pages/Pong';

const useSocketConnection = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  keyStateRef: any,
  posRacket: any,
  gameId: any,
  scorePlayers: any,
  bonusPositionRef: any,
  setGameStarted: any,
  bonusIsLoading: any,
  bonusValueRef: any,
  racketHeightRef: any,
) => {
  const data = useRef({});

  function normalizeGameData(serverData: any) {
    data.current = serverData;
    if (data.current.isPlayerRight === true) {
      data.current.ball.x = GROUND_MAX_SIZE - serverData.ball.x;
      data.current.ball.vx = -serverData.ball.vx;
      posRacket.current.right = serverData.racketLeft;
      scorePlayers.current.left = serverData.player1Score;
      scorePlayers.current.right = serverData.player2Score;
      racketHeightRef.current.left = serverData.racketRightHeight;
      racketHeightRef.current.right = serverData.racketLeftHeight;
      if (serverData.bonus) {
      bonusPositionRef.current = serverData.bonus;
        bonusPositionRef.current.x = GROUND_MAX_SIZE - serverData.bonus.x;
      }
      bonusIsLoading.current = serverData.bonusPlayer2Loading;
      bonusValueRef.current = serverData.bonusPlayer2?.id;
      }
     else {
      racketHeightRef.current.left = serverData.racketLeftHeight;
      racketHeightRef.current.right = serverData.racketRightHeight;
      scorePlayers.current.left = serverData.player2Score;
      scorePlayers.current.right = serverData.player1Score;
      posRacket.current.right = serverData.racketRight;
      bonusPositionRef.current = serverData.bonus;
      bonusIsLoading.current = serverData.bonusPlayer1Loading;
      bonusValueRef.current = serverData.bonusPlayer1?.id;
    }
    gameId.current = serverData.gameId;
    return data.current;
  }

  useEffect(() => {
    if (!socket) return;
    const intervalId: NodeJS.Timeout = setInterval(() => {
      socket.emit('clientUpdate', {
        posRacket: posRacket.current.left,
        ArrowDown: keyStateRef.current['ArrowDown'],
        ArrowUp: keyStateRef.current['ArrowUp'],
        gameId: gameId.current,
        useBonus: keyStateRef.current[' '],
      });
    }, 1000 / 60);

    socket.on('gameUpdate', (serverData) => {
      data.current = normalizeGameData(serverData);
      if (data.current.gameStart) {
        setGameStarted(true);
      }
      
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      socket.off('gameUpdate');
    };
  }, []);

  return { gameData: data, gameId };
};

export default useSocketConnection;
