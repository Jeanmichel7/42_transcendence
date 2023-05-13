import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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
    left: props.type === 'right' ? '5%' : '93%',
    transform: `translateY(${props.posY}px)`,
  },
}))`
  width: 2%;
  height: 16%;
  background-color: blue;
  position: absolute;
  left: ${(props) => (props.type === 'right' ? '5%' : '93%')};
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
  const [posRacketLeft, setPosition] = useState(0);
  const keyStateRef = useRef({} as any);
  const [ball, setBall] = useState({ x: 0, y: 0, vx: 2, vy: 2 });

  useEffect(() => {
    let animationFrameId: number;
    function upLoop() {
      if (keyStateRef.current['ArrowDown']) {
        setPosition((oldPos) => (oldPos < 250 ? oldPos + 5 : oldPos));
      } else if (keyStateRef.current['ArrowUp']) {
        setPosition((oldPos) => (oldPos > -250 ? oldPos - 5 : oldPos));
      }
      setBall((oldBall) => {
        if (oldBall.x > 400 || oldBall.x < -400) {
          return {
            ...oldBall,
            x: oldBall.x - oldBall.vx,
            y: oldBall.y + oldBall.vy,
            vx: -oldBall.vx,
          };
        }
        if (oldBall.y > 300 || oldBall.y < -300) {
          return {
            ...oldBall,
            x: oldBall.x + oldBall.vx,
            y: oldBall.y - oldBall.vy,
            vy: -oldBall.vy,
          };
        }
        return {
          ...oldBall,
          x: oldBall.x + oldBall.vx,
          y: oldBall.y + oldBall.vy,
        };
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
      <Racket posY={posRacketLeft} type="right" />
      <Ball posX={ball.x} posY={ball.y} />
      <Racket type="left" />
    </GameWrapper>
  );
}

export default Game;
