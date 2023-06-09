import React, { useEffect, useRef, useState } from 'react';
import styled, {keyframes} from 'styled-components';
import EndGame from '../components/Game/EndGame';
import Score from '../components/Game/Score';
import { BiWindows } from 'react-icons/bi';
import { io } from 'socket.io-client';
import useSocketConnection from '../components/Game/useSocketConnection'; 
import Lobby from '../components/Game/Lobby'; 
import SearchingOpponent from '../components/Game/SearchingOpponent'; 
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from '../components/Game/Interface';
import { useSelector, useDispatch } from 'react-redux'
import {Overlay} from '../components/Game/Overlay';
import CountDown from '../components/Game/CountDown';
import BonusBox from '../components/Game/BonusBox';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 10;
const BALL_RADIUS = BALL_DIAMETER / 2;
// max position of ball on X axis for compensate ball radius
export const GROUND_MAX_SIZE = 1000;
const INITIAL_BALL_SPEED = 0.25;
// POSITION_THRESHOLD value for correction of ball position with server state
const POSITION_THRESHOLD = 30;
const SPEED_INCREASE = 0.04;


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
  overflow: hidden;
`;

const Bonus = styled.div`
width: 10px;
height: 10px;
border : 1px solid red;
position: absolute;
left: ${(props) => props.posX}px;
top: ${(props) => props.posY}px;
`


const Racket = styled.div.attrs((props) => ({
  style: {
    transform: `translateY(${props.posY * ((100 / props.height) )}%)`,
  },
}))`
  width: ${RACKET_WIDTH}%;
  height: ${(props) => props.height / 10}%;
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

const laserGlow = keyframes`
  0% { box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.7); }
  50% { box-shadow: 0 0 20px 3px rgba(255, 0, 0, 0.9); }
  100% { box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.7); }
`;

const laserFlow = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 50px 0; }
`;

// Use the animations in your component
const Laser = styled.div`
  position: absolute;
  width: 100000px;
  height: 10px;
  top: 50%;
  z-index: 10;
  background: linear-gradient(to right, red, white, red);
  background-size: 50px 100%;
  animation: ${laserFlow} 0.1s linear infinite, ${laserGlow} 1s ease-in-out infinite;
`;





function Game({
  socket,
  lastGameInfo,
  setCurrentPage,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  lastGameInfo: any;
  setCurrentPage: any;
}) {
  const posRacket = useRef({
    left: 500 - RACKET_HEIGHT_10 / 2,
    right: 500 - RACKET_HEIGHT_10 / 2,
  });
  const keyStateRef = useRef({} as any);
  const [ball, setBall] = useState({
    x: 500,
    y: 500,
    vx: INITIAL_BALL_SPEED,
    vy: 0,
    speed: INITIAL_BALL_SPEED,
  });
  const gameWidth = useRef(0);
  const scorePlayers = useRef({ left: 0, right: 0 });
  const gameDimensions = useRef({ width: 0, height: 0 });
  const lastDateTime = useRef(0);
  const gameId = useRef(0);
  const [gameStarted, setGameStarted] = useState();
  const bonusPositionRef = useRef({} as any);
  const bonusIsLoading = useRef(false);
  const bonusValueRef = useRef();
  const racketHeightRef = useRef({left : RACKET_HEIGHT_10, right : RACKET_HEIGHT_10});
  const { gameData } = useSocketConnection(
    socket,
    keyStateRef,
    posRacket,
    gameId,
    scorePlayers,
    bonusPositionRef,
    setGameStarted,
    bonusIsLoading,
    bonusValueRef,
    racketHeightRef
  );
  const fail = useRef(false);
  const correctionFactor = useRef(0);

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
    if (!gameStarted) {
      setBall((oldBall) => {
        let newBall = { ...oldBall };
        newBall.vx = 0 ;
        newBall.vy = 0;
        newBall.x = 500;
        newBall.y = 500;
        return newBall;
      })
      return;
    };
    upLoop();
    function upLoop() {
      console.log(gameData.current.bonus);
      const currentTime = performance.now();
      let deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      if (keyStateRef.current['ArrowDown']) {
        posRacket.current.left =
          posRacket.current.left < 1000 - racketHeightRef.current.left
            ? posRacket.current.left + 20
            : posRacket.current.left;
      } else if (keyStateRef.current['ArrowUp']) {
        posRacket.current.left =
          posRacket.current.left > 0
            ? posRacket.current.left - 20
            : posRacket.current.left;
      }
      setBall((oldBall) => {
        let newBall = { ...oldBall };

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
          oldBall.y < posRacket.current.left + racketHeightRef.current.left && fail.current === false
        ) {
          newBall.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS;
 
            newBall.speed += SPEED_INCREASE;
            const racketCenter = posRacket.current.left + racketHeightRef.current.left / 2 ;
            const relativePostion = newBall.y - racketCenter;
            let proportion = relativePostion / (racketHeightRef.current.left / 2) ;
            proportion = Math.max(Math.min(proportion, 0.9), -0.9);
            newBall.vy = proportion   ;
            newBall.vx = Math.sqrt(1 - newBall.vy*newBall.vy) * newBall.speed;
            newBall.vy *= newBall.speed;
          
        } else if (
          oldBall.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS &&
          oldBall.y > posRacket.current.right &&
          oldBall.y < posRacket.current.right + racketHeightRef.current.right && fail.current === false
        ) {
          newBall.x = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;
              newBall.speed += SPEED_INCREASE;
              const racketCenter = posRacket.current.right + racketHeightRef.current.right / 2 ;
              const relativePostion = newBall.y - racketCenter;
              let proportion = relativePostion / (racketHeightRef.current.right / 2) ;
              proportion = Math.max(Math.min(proportion, 0.9), -0.9);
              newBall.vy = proportion;
              newBall.vx = Math.sqrt(1 - newBall.vy*newBall.vy) * newBall.speed;
              newBall.vy *= newBall.speed;
              newBall.vx = -newBall.vx;
          
        
      }
        else if (oldBall.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS || oldBall.x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS)
        {
          fail.current = true;
        }
      
        newBall.x += newBall.vx * deltaTime;
        newBall.y += newBall.vy * deltaTime;
        //console.log(gameData.current.ball);
        //console.log(newBall);

        if (
          Math.sign(newBall.vx) === Math.sign(gameData.current.ball?.vx) ||
          newBall.vx === 0 || gameData.current.ball?.vx === 0
        ) {
          newBall.vx = gameData.current.ball?.vx;
        }

        if (
          Math.sign(newBall.vy) === Math.sign(gameData.current.ball?.vy) ||
          newBall.vy === 0 || gameData.current.ball?.vy === 0
        ) {
          newBall.vy = gameData.current.ball?.vy;
        }
        if (
          Math.abs(newBall.x - gameData.current.ball?.x) > POSITION_THRESHOLD ||
          Math.abs(newBall.y - gameData.current.ball?.y) > POSITION_THRESHOLD
        ) {
          console.log('correction');
          fail.current = false;
          newBall.x = gameData.current.ball?.x;
          newBall.y = gameData.current.ball?.y;
          newBall.vx = gameData.current.ball?.vx;
          newBall.vy = gameData.current.ball?.vy;
          newBall.speed = gameData.current.ball?.speed;
        }

        return newBall;
      });
      if (gameData.current.winner == null) {
        animationFrameId = requestAnimationFrame(upLoop);
      } else {
        lastGameInfo.current.winnerName = gameData.current.winner;
        if (gameData.current.isPlayerRight === true) {
          if (gameData.current.winner === gameData.current.player1Username) {
            lastGameInfo.current.win = true;
          } else {
            lastGameInfo.current.win = false;
          }
        } else {
          if (gameData.current.winner === gameData.current.player1Username) {
            lastGameInfo.current.win = false;
          } else {
            lastGameInfo.current.win = true;
          }
        }
        setCurrentPage('finished');
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        console.log('cancelAnimationFrame');
      }
    };
  }, [gameStarted]);

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
    <div>
      {!gameStarted && <CountDown/>}
      <Score
        scorePlayerLeft={scorePlayers.current.left}
        scorePlayerRight={scorePlayers.current.right}
      />
      <Racket posY={posRacket.current.left} height={racketHeightRef.current.left} type="left" />
      <Ball
        posX={ball.x * (gameDimensions.current.width / 1000)}
        posY={ball.y * (gameDimensions.current.height / 1000)}
      />
        {gameData.current.bonus &&  <Bonus posX={bonusPositionRef.current.x *  (gameDimensions.current.width / 1000)} posY={bonusPositionRef.current.y * (gameDimensions.current.height / 1000)} />}
        <BonusBox bonusIsLoading={bonusIsLoading.current} bonusName={bonusValueRef.current}/>
        <Laser/>
      <Racket posY={posRacket.current.right} height={racketHeightRef.current.right}type="right" />
    </div>
  );
}

function Pong() {
  const [socket, setSocket] = useState({});
  const [connectStatus, setConnectStatus] = useState('disconnected');
  const [currentPage, setCurrentPage] = useState('lobby');
  const userData: any = useSelector((state: any) => state.user.userData);
  const lastGameInfo = useRef({} as any);
  useEffect(() => {
    const socket = io('http://localhost:3000/game', {
      withCredentials: true,
    });
    setSocket(socket);

    socket.on('connect', () => {
      setConnectStatus('connected');
      console.log('connected');
    });

    socket.on('disconnect', () => {
      setConnectStatus('disconnected');
      console.log('ERROR SOCKET DISCONNECTED');
    });

    socket.on('userGameStatus', (message) => {
      console.log('Pong status updtae', message);
      if (message === 'found') {
        setCurrentPage('game');
      }
      if (message === 'alreadyInGame') {
        setCurrentPage('game');
      }
      if (message === 'notInGame') {
        setCurrentPage('lobby');
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  let statusComponent;
  if (connectStatus === 'connecting') {
    statusComponent = <p>Connecting...</p>;
  } else {
    statusComponent = undefined;
  }
  let pageContent;
  if (currentPage === 'lobby') {
    pageContent = <Lobby setCurrentPage={setCurrentPage} />;
  } else if (currentPage === 'finished') {
    pageContent = (
      <EndGame setCurrentPage={setCurrentPage} lastGameInfo={lastGameInfo} />
    );
  } else if (currentPage === 'game') {
    pageContent = (
      <Game
        socket={socket}
        lastGameInfo={lastGameInfo}
        setCurrentPage={setCurrentPage}
      />
    );
  } else if (currentPage === 'searchOpponent') {
    pageContent = (
      <SearchingOpponent socket={socket} setCurrentPage={setCurrentPage} />
    );
  }
  return (
    <GameWrapper className="game-wrapper">
      {connectStatus === 'disconnected' && <Overlay />}
      {statusComponent}
      {pageContent}
    </GameWrapper>
  );
}

export default Pong;
