import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { GROUND_MAX_SIZE } from '../pong';

const useSocketConnection = (
  socket: any,
  dataClient: any,
  posRacket: any,
  gameId: string
) => {
  const data = useRef({});

  function normalizeGameData(data: any) {
    if (data.isPlayerRight === true) {
      console.log('OL');
      data.ball.x = GROUND_MAX_SIZE - data.ball.x;
      data.ball.vx = -data.ball.vx;
      posRacket.current.right = data.racketLeft;
    } else {
      posRacket.current.right = data.racketRight;
    }
    gameId = data.gameId;
    return data;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      socket.emit('clientUpdate', dataClient);
    }, 1000 / 60);

    socket.on('gameUpdate', (data) => {
      data.current = normalizeGameData(data);
    });
  }, []);

  return { gameData: data, gameId };
};

export default useSocketConnection;
