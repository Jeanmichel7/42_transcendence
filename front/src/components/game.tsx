import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Loose from './Game/Loose';
import Score from './Game/Score';
import { BiWindows } from 'react-icons/bi';
import { io } from 'socket.io-client';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 100;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 10;
const BALL_RADIUS = BALL_DIAMETER / 2;
// max position of ball on X axis for compensate ball radius
const GROUND_MAX_SIZE = 1000;
const INITIAL_BALL_SPEED = 0.4;
// threshold value for correction of ball position with server state
const THRESHOLD = 100;

// Variable constante for optimisation, don't change
const RACKET_FACTOR = (100 / RACKET_HEIGHT) * 100;
const RACKET_FACTOR_1000 = RACKET_FACTOR / 1000;
const RACKET_WIDTH_10 = RACKET_WIDTH * 10;
const RACKET_HEIGHT_10 = RACKET_HEIGHT * 10;
const RACKET_LEFT_POS_X_10 = RACKET_LEFT_POS_X * 10;
const RACKET_RIGHT_POS_X_10 = RACKET_RIGHT_POS_X * 10;

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
  top: 0%;
  border-radius: 10px;
`;

const Ball = styled.div.attrs((props) => {
  return {
    style: {
      transform: `translate(${props.posX - BALL_RADIUS}px, ${
        props.posY - BALL_RADIUS
      }px)`,
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
  const posRacket = useRef({ left: 0, right: 0 });
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
  const gameDimensions = useRef({ width: 0, height: 0 });
  const [fps, setFps] = useState(0);
  const lastDateTime = useRef(0);
  const gameData = useRef({} as any);
  const correctionFactor = useRef(0);

  const [socket, setSocket] = useState(null);

  function normalizeGameData(data: any) {
    if (data.isPlayerRight === true) {
      console.log('OL');
      data.ball.x = GROUND_MAX_SIZE - data.ball.x;
      data.ball.vx = -data.ball.vx;
      posRacket.current.right = data.racketLeft;
    } else {
      posRacket.current.right = data.racketRight;
    }
    return data;
  }

  useEffect(() => {
    const socket = io('http://localhost:3000/game');
    setSocket(socket);

    const intervalId = setInterval(() => {
      socket.emit('clientUpdate', {
        posRacket: posRacket.current.left,
        ArrowDown: keyStateRef.current['ArrowDown'],
        ArrowUp: keyStateRef.current['ArrowUp'],
        gameId: gameData.current.gameId,
      });
    }, 1000 / 60);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('serverUpdate', (data) => {
      gameData.current = normalizeGameData(data);
      console.log(data);
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
        gameDimensions.current.width = gameWrapper.offsetWidth;
        gameDimensions.current.height = gameWrapper.offsetHeight;
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
        posRacket.current.left =
          posRacket.current.left < 1000 - RACKET_HEIGHT_10
            ? posRacket.current.left + 10
            : posRacket.current.left;
      } else if (keyStateRef.current['ArrowUp']) {
        posRacket.current.left =
          posRacket.current.left > 0
            ? posRacket.current.left - 10
            : posRacket.current.left;
      }
      setBall((oldBall) => {
        let newBall = { ...oldBall };

        if (
          oldBall.x + BALL_RADIUS > GROUND_MAX_SIZE ||
          oldBall.x - BALL_RADIUS < 0
        ) {
          newBall.vx = -newBall.vx;
          if (oldBall.x + BALL_RADIUS > GROUND_MAX_SIZE) {
            newBall.x = GROUND_MAX_SIZE - BALL_RADIUS;
          } else {
            newBall.x = 0 + BALL_RADIUS;
          }
        }
        if (
          oldBall.y + BALL_RADIUS > GROUND_MAX_SIZE ||
          oldBall.y - BALL_RADIUS < 0
        ) {
          if (oldBall.y + BALL_RADIUS > GROUND_MAX_SIZE) {
            newBall.y = GROUND_MAX_SIZE - BALL_RADIUS;
          } else {
            newBall.y = 0 + BALL_RADIUS;
          }
          newBall.vy = -newBall.vy;
        }
        if (
          oldBall.x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS &&
          oldBall.y > posRacket.current.left &&
          oldBall.y < posRacket.current.left + RACKET_HEIGHT_10
        ) {
          newBall.vx = -newBall.vx;
          newBall.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS;
        } else if (
          oldBall.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS &&
          oldBall.y > posRacket.current.right &&
          oldBall.y < posRacket.current.right + RACKET_HEIGHT_10
        ) {
          newBall.vx = -newBall.vx;
          newBall.x = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;
        }
        newBall.x += newBall.vx * deltaTime;
        newBall.y += newBall.vy * deltaTime;

        if (
          correctionFactor.current !== 0 ||
          Math.abs(newBall.x - gameData.current.ball?.x) > THRESHOLD ||
          Math.abs(newBall.y - gameData.current.ball?.y) > THRESHOLD
        ) {
          correctionFactor.current += 0.05;
          console.log(correctionFactor.current);
          newBall.x +=
            (gameData.current.ball?.x - newBall.x) * correctionFactor.current;
          newBall.y +=
            (gameData.current.ball?.y - newBall.y) * correctionFactor.current;
          if (correctionFactor.current >= 1) correctionFactor.current = 0;
        }
        if (
          Math.abs(newBall.vx - gameData.current.ball?.vx) > THRESHOLD ||
          Math.abs(newBall.vy - gameData.current.ball?.vy) > THRESHOLD
        ) {
          newBall.vx = gameData.current.ball?.vx;
          newBall.vy = gameData.current.ball?.vy;
        }

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
      <Racket posY={posRacket.current.left} type="left" />
      <Ball
        posX={ball.x * (gameDimensions.current.width / 1000)}
        posY={ball.y * (gameDimensions.current.height / 1000)}
      />
      <Racket posY={posRacket.current.right} type="right" />
    </GameWrapper>
  );
}

export default Game;
