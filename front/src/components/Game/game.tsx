import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Loose from './Loose';
import Score from './Score';
import { BiWindows } from 'react-icons/bi';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 1;
const BALL_POS_MAX = 980;

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
  width: ${BALL_DIAMETER}vh;
  height: ${BALL_DIAMETER}vh;
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
  const [ball, setBall] = useState({ x: 500, y: 500, vx: 10, vy: 10 });
  const [scorePlayerLeft, setScorePlayerLeft] = useState(0);
  const [scorePlayerRight, setScorePlayerRight] = useState(0);
  const gameWidth = useRef(0);
  const loose = useRef(false);
  const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
  const [fps, setFps] = useState(0);
  /*
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://your-websocket-url');
    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };
    socket.onmessage = (event) => {
      console.log('Received data from WebSocket:', event.data);
    };
    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.send(message);
    }
  };
*/
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
      const deltaTime = currentTime - lastTime;
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
        }
        if (oldBall.y > BALL_POS_MAX || oldBall.y < 0) {
          newBall.vy = -newBall.vy;
        }
        if (
          oldBall.x <= RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 &&
          oldBall.y >= posRacketLeft.current &&
          oldBall.y <= posRacketLeft.current + RACKET_HEIGHT_10
        ) {
          newBall.vx = -newBall.vx;
          if (keyStateRef.current['ArrowDown']) {
            newBall.vy += 1;
            newBall.vx -= 1;
          } else if (keyStateRef.current['ArrowUp']) {
            newBall.vy -= 1;
            newBall.vx += 1;
          }
        }
        if (oldBall.x <= 0 && !loose.current) {
          loose.current = true;
          setScorePlayerLeft((oldScore) => oldScore + 1);
        }
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
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

  return (
    <GameWrapper className="game-wrapper">
      <p style={{ color: 'white' }}>{`FPS: ${fps.toFixed(2)}`}</p>
      <Score
        scorePlayerLeft={scorePlayerLeft}
        scorePlayerRight={scorePlayerRight}
      />
      {loose.current && <Loose />}
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
