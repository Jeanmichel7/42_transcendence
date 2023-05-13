import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const RACKET_WIDTH = 18;
const RACKET_HEIGHT = 100;
const RACKET_LEFT_POS_X = 50;
const RACKET_RIGHT_POS_X = 730;

const GameWrapper = styled.div`
  width: 800px;
  height: 600px;
  background-color: black;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
`;

const Racket = styled.div.attrs((props) => ({
  style: {
    transform: `translateY(${props.posY}px)`,
  },
}))`
  width: ${RACKET_WIDTH}px;
  height: ${RACKET_HEIGHT}px;
  background-color: blue;
  position: absolute;
  left: ${(props) =>
    props.type === 'left'
      ? RACKET_LEFT_POS_X + 'px'
      : RACKET_RIGHT_POS_X + 'px'};
  top: 42%;
  transform: translateY(${(props) => props.posY}px);
  border-radius: 10px;
`;

const Ball = styled.div.attrs((props) => ({
  style: {
    transform: `translate(${props.posX}px, ${props.posY}px)`,
  },
}))`
  width: 10px;
  height: 10px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
`;

function Game() {
  const [posRacketLeft, setPositionLeft] = useState(0);
  const [posRacketRight, setPositionRight] = useState(0);
  const keyStateRef = useRef({} as any);
  const [ball, setBall] = useState({ x: 0, y: 0, vx: 2, vy: 2 });

  useEffect(() => {
    let animationFrameId: number;
    function upLoop() {
      if (keyStateRef.current['ArrowDown']) {
        setPositionLeft((oldPos) => (oldPos < 250 ? oldPos + 5 : oldPos));
      } else if (keyStateRef.current['ArrowUp']) {
        setPositionLeft((oldPos) => (oldPos > -250 ? oldPos - 5 : oldPos));
      }
      setBall((oldBall) => {
        let newBall = { ...oldBall };
        if (oldBall.x > 390 || oldBall.x < -400) {
          newBall.vx = -newBall.vx;
        }
        if (oldBall.y > 290 || oldBall.y < -300) {
          newBall.vy = -newBall.vy;
        }
        console.log(posRacketRight - 300);
        if (
          oldBall.x <= RACKET_LEFT_POS_X - 400 &&
          oldBall.y >= posRacketRight - 300 &&
          oldBall.y <= posRacketRight - 300 + RACKET_HEIGHT
        ) {
          newBall.vx = -newBall.vx;
        }

        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
        return newBall;
      });
      animationFrameId = requestAnimationFrame(upLoop);
    }
    upLoop();

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
    <GameWrapper>
      <Racket posY={posRacketLeft} type="left" />
      <Ball posX={ball.x} posY={ball.y} />
      <Racket posY={posRacketRight} type="right" />
    </GameWrapper>
  );
}

export default Game;
