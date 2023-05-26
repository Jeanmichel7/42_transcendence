import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Loose from './Game/Loose';
import Score from './Game/Score';
import { BiWindows } from 'react-icons/bi';
import { io } from 'socket.io-client';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 200;
// max position of ball on X axis for compensate ball radius
const BALL_POS_MAX = 800;
const INITIAL_BALL_SPEED = 0.1;
// threshold value for correction of ball position with server state
const THRESHOLD = 400;
const SPEED_INCREASE = 0.06;

// Variable constante for optimisation, don't change
const RACKET_FACTOR = (100 / RACKET_HEIGHT) * 100;
const RACKET_FACTOR_1000 = RACKET_FACTOR / 1000;
const RACKET_WIDTH_10 = RACKET_WIDTH * 10;
const RACKET_HEIGHT_10 = RACKET_HEIGHT * 10;
const RACKET_LEFT_POS_X_10 = RACKET_LEFT_POS_X * 10;

const GameWrapper = styled.div`
  width: 80vw;
  height: 50vh;
  background-color: black;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
`;

const Racket = styled.div.attrs((props) => ({
  style: {
    transform: `translateY(${props.posY * RACKET_FACTOR_1000}%)`,
  },
}))`
  width: ${RACKET_WIDTH}%;
  height: ${RACKET_HEIGHT}%;
  background-color: blue;
  position: absolute;
  left: ${(props) =>
    props.type === 'left' ? RACKET_LEFT_POS_X + '%' : RACKET_RIGHT_POS_X + '%'};
  top: %;
  border-radius: 10px;
`;

const Ball = styled.div.attrs((props) => {
  return {
    style: {
      transform: `translate(${props.posX}px, ${props.posY}px)`,
    },
  };
})`
  width: ${BALL_DIAMETER}px;
  height: ${BALL_DIAMETER}px;
  background-color: white;
  position: absolute;
  left: 0%;
  top: 0%;
  border-radius: 50%;
`;

function Game() {
  const [posRacketLeftState, setPositionLeft] = useState(0);
  const posRacketLeft = useRef(0);
  const [posRacketRightState, setPositionRight] = useState(0);
  const keyStateRef = useRef({} as any);
  const [ball, setBall] = useState({
    x: 500,
    y: 500,
    vx: INITIAL_BALL_SPEED,
    vy: INITIAL_BALL_SPEED,
  });
  const [scorePlayerLeft, setScorePlayerLeft] = useState(0);
  const [scorePlayerRight, setScorePlayerRight] = useState(0);
  const gameWidth = useRef(0);
  const loose = useRef();
  const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
  const [fps, setFps] = useState(0);
  const lastDateTime = useRef(0);
  const gameData = useRef({} as any);

  const [socket, setSocket] = useState(null);

  function normalizeGameData(data: any) {
    if (data.isPlayerRight === true) {
      data.ball.x = -data.ball.x;
      data.ball.y = -data.ball.y;
    }
    return data;
  }

  useEffect(() => {
    const socket = io('http://localhost:3000/game');
    setSocket(socket);

    const intervalId = setInterval(() => {
      socket.emit('clientUpdate', {
        posRacket: posRacketLeft.current,
        ArrowDown: keyStateRef.current['ArrowDown'],
        ArrowUp: keyStateRef.current['ArrowUp'],
        gameId: gameData.current.gameId,
      });
    }, 1000 / 20);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('serverUpdate', (data) => {
      gameData.current = normalizeGameData(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const gameWrapper = document.querySelector('.game-wrapper');
      if (gameWrapper) {
        setGameDimensions({
          width: gameWrapper.offsetWidth,
          height: gameWrapper.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let lastTime = performance.now();

  useEffect(() => {
    let animationFrameId: number;
    upLoop();
    function upLoop() {
      const currentTime = performance.now();
      let deltaTime = currentTime - lastTime;
      if (deltaTime > 0) {
        setFps(1000 / deltaTime);
      }
      lastTime = currentTime;
      if (keyStateRef.current['ArrowDown']) {
        setPositionLeft((oldPos) =>
          oldPos < 1000 - RACKET_HEIGHT_10 ? oldPos + 10 : oldPos
        );
        posRacketLeft.current =
          posRacketLeft.current < 1000 - RACKET_HEIGHT_10
            ? posRacketLeft.current + 10
            : posRacketLeft.current;
      } else if (keyStateRef.current['ArrowUp']) {
        setPositionLeft((oldPos) => (oldPos > 0 ? oldPos - 10 : oldPos));
        posRacketLeft.current =
          posRacketLeft.current > 0
            ? posRacketLeft.current - 10
            : posRacketLeft.current;
      }
      setBall((oldBall) => {
        let newBall = { ...oldBall };

        if (oldBall.x > BALL_POS_MAX || oldBall.x < 0) {
          newBall.vx = -newBall.vx;
          if (oldBall.x > BALL_POS_MAX) {
            newBall.x = BALL_POS_MAX;
          } else {
            newBall.x = 0;
          }
        }
        if (oldBall.y > BALL_POS_MAX || oldBall.y < 0) {
          if (oldBall.y > BALL_POS_MAX) {
            newBall.y = BALL_POS_MAX;
          } else {
            newBall.y = 0;
          }
          newBall.vy = -newBall.vy;
        }
        if (
          oldBall.x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 &&
          oldBall.y > posRacketLeft.current &&
          oldBall.y < posRacketLeft.current + RACKET_HEIGHT_10
        ) {
          newBall.vx = -newBall.vx;
          newBall.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10;

          if (keyStateRef.current['ArrowDown']) {
            newBall.vy += SPEED_INCREASE;
          }
          if (keyStateRef.current['ArrowUp']) {
            newBall.vy -= SPEED_INCREASE;
          }
        }
        newBall.x += newBall.vx * deltaTime;
        newBall.y += newBall.vy * deltaTime;
        console.log(Math.abs(newBall.x - gameData.current.ball?.x));
        /*
        if (
          Math.abs(newBall.x - gameData.current.ball?.x) > THRESHOLD ||
          Math.abs(newBall.y - gameData.current.ball?.y) > THRESHOLD
        ) {
          console.log('correction with state server');
          newBall.x = gameData.current.ball?.x;
          newBall.y = gameData.current.ball?.y;
          newBall.vx = gameData.current.ball?.vx;
          newBall.vy = gameData.current.ball?.vy;
        }*/
        return newBall;
      });
      if (!loose.current) {
        animationFrameId = requestAnimationFrame(upLoop);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        console.log('cancelAnimationFrame');
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: any) {
      keyStateRef.current[e.key] = true;
    }

    function handleKeyUp(e: any) {
      keyStateRef.current[e.key] = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function sendMessage(message) {
    if (socket) {
      socket.emit('message', 'Hello', (response) => {
        console.log('Received response from server:', response);
      });
    }
  }

  return (
    <GameWrapper className="game-wrapper">
      <p style={{ color: 'white' }}>{`FPS: ${fps.toFixed(2)}`}</p>
      <Score
        scorePlayerLeft={scorePlayerLeft}
        scorePlayerRight={scorePlayerRight}
      />
      {loose && <Loose loose={loose} />}
      <Racket posY={posRacketLeftState} type="left" />
      <Ball
        posX={ball.x * (gameDimensions.width / 1000)}
        posY={ball.y * (gameDimensions.height / 1000)}
      />
      <Racket posY={posRacketRightState} type="right" />
    </GameWrapper>
  );
}

export default Game;
