import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Loose from './Loose';
import Score from './Score';

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
  top: 0%;
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
  left: 0%;
  top: 0%;
  border-radius: 50%;
`;

function Game() {
  const [posRacketLeftState, setPositionLeft] = useState(0);
  const posRacketLeft = useRef(0);
  const [posRacketRightState, setPositionRight] = useState(0);
  const keyStateRef = useRef({} as any);
  const [ball, setBall] = useState({ x: 400, y: 300, vx: 5, vy: 5 });
  const [scorePlayerLeft, setScorePlayerLeft] = useState(0);
  const [scorePlayerRight, setScorePlayerRight] = useState(0);
  const loose = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    upLoop();
    function upLoop() {
      if (keyStateRef.current['ArrowDown']) {
        setPositionLeft((oldPos) => (oldPos < 500 ? oldPos + 5 : oldPos));
        posRacketLeft.current =
          posRacketLeft.current < 500
            ? posRacketLeft.current + 5
            : posRacketLeft.current;
      } else if (keyStateRef.current['ArrowUp']) {
        setPositionLeft((oldPos) => (oldPos > 0 ? oldPos - 5 : oldPos));
        posRacketLeft.current =
          posRacketLeft.current > 0
            ? posRacketLeft.current - 5
            : posRacketLeft.current;
      }
      setBall((oldBall) => {
        let newBall = { ...oldBall };
        if (oldBall.x > 790 || oldBall.x < 0) {
          newBall.vx = -newBall.vx;
        }
        if (oldBall.y > 590 || oldBall.y < 0) {
          newBall.vy = -newBall.vy;
        }
        if (
          oldBall.x <= RACKET_LEFT_POS_X + RACKET_WIDTH &&
          oldBall.y >= posRacketLeft.current &&
          oldBall.y <= posRacketLeft.current + RACKET_HEIGHT
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
    <GameWrapper>
      <Score
        scorePlayerLeft={scorePlayerLeft}
        scorePlayerRight={scorePlayerRight}
      />
      {loose.current ? <Loose /> : null}
      <Racket posY={posRacketLeftState} type="left" />
      <Ball posX={ball.x} posY={ball.y} />
      <Racket posY={posRacketRightState} type="right" />
    </GameWrapper>
  );
}

export default Game;
