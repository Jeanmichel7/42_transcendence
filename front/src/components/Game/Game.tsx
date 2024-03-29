import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Socket } from 'socket.io-client';
import useSocketConnection from './useSocketConnection';
import {
  ClientToServerEvents,
  GameData,
  ServerToClientEvents,
  BonusPosition,
} from './Interface';
import CountDown from './CountDown';
import spriteBonus from '../../assets/spriteBonus.png';
import spriteBonusExplode from '../../assets/spriteBonusExplode.png';
import './font.css';
import EndGame from './EndGame';
import StatutBar from './StatutBar';
import { DisconnectCountDown } from './DisconnectCountDown';
import spriteRacket from '../../assets/spriteRacket.png';
import ballElectricity from '../../assets/ballElectricity.png';

export const Playground = styled.div`
  width: 90%;
  top: 20%;
  left: 5%;
  overflow: hidden;
  height: 75%;
  bottom: 5%;
  position: absolute;
  background-color: #000;
  border: 10px 
  border: 0.2rem solid #fff;
  box-shadow: 0 0 .2rem #fff,
            0 0 .2rem #fff,
            0 0 2rem #bc13fe,
            0 0 0.8rem #bc13fe,
            0 0 2.8rem #bc13fe,
            inset 0 0 1.3rem #bc13fe; 
            color: #fff;
`;

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 20;
const BALL_RADIUS = BALL_DIAMETER / 2;
// max position of ball on X axis for compensate ball radius
export const GROUND_MAX_SIZE = 1000;
const INITIAL_BALL_SPEED = 0.40;
// POSITION_THRESHOLD value for correction of ball position with server state
const POSITION_THRESHOLD = 30;
const SPEED_INCREASE = 0.04;
const RACKET_SPEED = 20; // Vitesse normale
const FINE_RACKET_SPEED = 5;

// Variable constante for optimisation, don't change
const RACKET_WIDTH_10 = RACKET_WIDTH * 10;
const RACKET_HEIGHT_10 = RACKET_HEIGHT * 10;
const RACKET_LEFT_POS_X_10 = RACKET_LEFT_POS_X * 10;
const RACKET_RIGHT_POS_X_10 = RACKET_RIGHT_POS_X * 10;
const RACKET_LEFT_HITBOX_BOUNDARY =
  RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS;
const RACKET_RIGHT_HITBOX_BOUNDARY = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;

const animationBonus = keyframes`
  0% { background-position: 0px; }
  100% { background-position: -1200px; } // Ajustez en fonction de la taille de votre sprite
`;

const animationBonusExplode = keyframes`
  0% { background-position: 0px; opacity: 1; }
  100% { background-position: -2400px; opacity: 0;}
  `;

const explosionAnimation = keyframes`{
    0% { background-position: 0px; opacity: 1; }
    100% { background-position: -2400px; opacity: 0;}
  }`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const BonusReady = styled.div<{ posX: number; posY: number }>`
  width: 50px; // La largeur d'une image de sprite individuelle
  height: 50px; // La hauteur de votre sprite
  background: url(${spriteBonus}) repeat-x;
  position: absolute;
  transform: translate(-50%, -50%);
  left: ${({ posX }) => posX}px;
  top: ${({ posY }) => posY}px;
  animation: ${animationBonus} 1s steps(12) infinite, ${fadeIn} 1s ease-in-out;
`;

const BonusExplode = styled.div<{ posX: number; posY: number }>`
  width: 200px; // La largeur d'une image de sprite individuelle
  height: 200px; // La hauteur de votre sprite
  background: url(${spriteBonusExplode}) repeat-x;
  position: absolute;
  transform: translate(-50%, -50%);
  left: ${({ posX }) => posX}px;
  top: ${({ posY }) => posY}px;
  animation: ${animationBonusExplode} 1s steps(12);
  animation-fill-mode: forwards;
`;

export function Bonus({
  bonus,
  posX,
  posY,
}: {
  bonus: BonusPosition | undefined;
  posX: number;
  posY: number;
}) {
  const [isBonusVisible, setIsBonusVisible] = useState(false);
  const [isBonusExplode, setBonusExplode] = useState(false);
  const [position, setPosition] = useState([-1, -1]);
  useEffect(() => {
    if (bonus !== undefined && bonus !== null) {
      setBonusExplode(false);
      setIsBonusVisible(true);
      setPosition([posX, posY]);
    } else if (position[0] !== -1) {
      setIsBonusVisible(false);
      setBonusExplode(true);
    }
  }, [bonus]);
  return (
    <div>
      {isBonusVisible && <BonusReady posX={position[0]} posY={position[1]} />}
      {isBonusExplode && <BonusExplode posX={position[0]} posY={position[1]} />}
    </div>
  );
}

type RacketProps = {
  posY: number;
  height: number;
  type: string;
  isExploding: boolean;
};

interface StyleProps {
  style: {
    transform: string;
  };
}

const StyledRacket = styled.div.attrs<RacketProps>(
  (props): StyleProps => ({
    style: {
      transform: `translateY(${props.posY * (100 / props.height)}%)`,
    },
  }),
)<RacketProps>`
  width: ${RACKET_WIDTH}%;
  height: ${props => props.height / 10}%;
  position: absolute;
  left: ${props =>
    props.type === 'left' ? RACKET_LEFT_POS_X + '%' : RACKET_RIGHT_POS_X + '%'};
  top: 0%;
  z-index: 2;
  &:before {
    top: 10px;
    width: 100%;
    content: '';
    position: absolute;
    background-color: blue;
    opacity: ${props => (props.isExploding ? 0 : 1)};
    height: calc(100% - 20px);
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe,
      0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
  }
  &:after {
    content: ${props => (props.isExploding ? "''" : 'none')};
    width: 200px;
    height: 400px;
    background: url(${spriteRacket}) no-repeat;
    background-position: 0 0; /* début du sprite */
    animation: ${explosionAnimation} 1.5s steps(12) forwards;
    position: absolute;
    top: -150px; /* Vous devrez peut-être ajuster ces valeurs */
    left: -95px; /* pour centrer l'explosion sur la rackette */
    transform-origin: 50% 0; /* Centre supérieur */
    z-index: 10;
  }
`;

export const Racket = ({
  posY,
  height,
  type,
  children,
}: {
  posY: number;
  height: number;
  type: string;
  children: ReactNode;
}) => {
  const oldheight = useRef(height);
  if (height !== oldheight.current && height !== 0) {
    oldheight.current = height;
  }
  return (
    <StyledRacket
      posY={posY}
      height={oldheight.current}
      type={type}
      isExploding={height === 0}
    >
      {children}
    </StyledRacket>
  );
};
// Composant Raquette avec le Laser comme enfant

interface BallProps {
  posX: number;
  posY: number;
}

const ballAnimation = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: -6144px 0px; // 12 images * 512px par image - 512px = 6656px
  }
`;

interface BallProps {
  posX: number;
  posY: number;
  electricity: boolean | undefined;
}

// export const Ball = styled.div.attrs<BallProps>(props => {
//   return {
//     style: {
//       transform: `translate(${props.posX - BALL_RADIUS}px, ${
//         props.posY - BALL_RADIUS
//       }px)`,
//     },
//   };
// })<BallProps>`
//   width: ${BALL_DIAMETER}px;
//   height: ${BALL_DIAMETER}px;
//   background-color: white;
//   position: absolute;
//   left: 0%;
//   top: 0%;
//   border-radius: 50%;
//   transform: translate(-50%, -50%);

//   &::before {
//     content: '';
//     display: ${props => (props.electricity ? 'block' : 'none')};
//     background-image: url(${ballElectricity});
//     background-size: 2048px 1536px; // Ajustez selon vos besoins
//     width: 512px; /* Taille de chaque sprite */
//     height: 512px;
//     transform: translate(-50%, -50%) scale(0.15); /* Centre le sprite */
//     position: absolute;
//     animation: ${ballAnimation} 1.2s steps(12) infinite;
//   }
// `;
export const Ball = styled.div.attrs<BallProps>(props => {
  return {
    style: {
      left: `${props.posX - BALL_RADIUS}px`,
      top: `${props.posY - BALL_RADIUS}px`,
    },
  };
})<BallProps>`
  width: ${BALL_DIAMETER}px;
  height: ${BALL_DIAMETER}px;
  background-color: white;
  position: absolute;
  border-radius: 50%;

  &::before {
    content: '';
    display: ${props => (props.electricity ? 'block' : 'none')};
    background-image: url(${ballElectricity});
    background-size: 6144px 512px;
    background-position: 0px 0px;
    width: 512px;
    height: 512px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.15); // pour centrer le sprite
    animation: ${ballAnimation} 1s steps(12) infinite;
  }
`;

const laserGlow = keyframes`
  0% { box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.7); }
  50% { box-shadow: 0 0 20px 3px rgba(255, 0, 0, 0.9); }
  100% { box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.7); }
`;

const laserFlowRight = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 50px 0; }
`;

const laserFlowLeft = keyframes`
  0% { background-position: 50px 0; }
  100% { background-position: 0 0; }
`;

export interface LaserProps {
  type: string;
}
export const Laser = styled.div<LaserProps>`
  position: absolute;

  width: ${({ type }: { type: string }) =>
    type === 'left' ? '10000px' : '10000px'};
  height: 10px;
  top: 50%;
  z-index: 1;
  background: ${({ type }: { type: string }) =>
    type === 'left'
      ? 'linear-gradient(to right, red, white, red)'
      : 'linear-gradient(to left, red, white, red)'};
  background-size: 50px 100%;
  animation: ${({ type }: { type: string }) =>
    type === 'left'
      ? css`
          ${laserFlowRight} 0.1s linear infinite, ${laserGlow} 1s ease-in-out infinite
        `
      : css`
          ${laserFlowLeft} 0.1s linear infinite, ${laserGlow} 1s ease-in-out infinite
        `};
  transform: ${({ type }: { type: string }) =>
      type === 'left' ? 'translateX(0%)' : 'translateX(-10000px)'}
    translateY(-5px);
  left: 100%;
`;

export const GameWrapper = styled.div`
  animation: ${fadeIn} 1s ease-in-out;

  width: 100%;
`;

export interface PlayersInfo {
  playerLeftUsername: string;
  playerRightUsername: string;
  playerLeftAvatar: string;
  playerRightAvatar: string;
}

function Game({
  socket,
  lastGameInfo,
  setCurrentPage,
  bonus,
  isChatOpen,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  lastGameInfo: any;
  setCurrentPage: Dispatch<SetStateAction<string>>;
  bonus: boolean;
  isChatOpen: boolean;
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
  const scorePlayers = useRef({ left: 0, right: 0 });
  const gameDimensions = useRef({ width: 0, height: 0 });
  const gameId = useRef(0);

  const [gameStarted, setGameStarted] = useState(false);
  const bonusPositionRef = useRef<BonusPosition | undefined>();
  const [playerInfo, setPlayerInfo] = useState<PlayersInfo | undefined>();
  const bonusIsLoading = useRef(false);
  const bonusValueRef = useRef();
  const racketHeightRef = useRef({
    left: RACKET_HEIGHT_10,
    right: RACKET_HEIGHT_10,
  });
  const laser = useRef({ left: false, right: false } as any);
  const { gameData }: { gameData: MutableRefObject<GameData | undefined> } =
    useSocketConnection(
      socket,
      keyStateRef,
      posRacket,
      gameId,
      scorePlayers,
      bonusPositionRef,
      setGameStarted,
      bonusIsLoading,
      bonusValueRef,
      racketHeightRef,
      laser,
      playerInfo,
      setPlayerInfo,
    );

  const fail = useRef(false);
  const [ShowEndGame, setShowEndGame] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const gameWrapper = document.querySelector('#playground') as HTMLElement;
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
  }, [isChatOpen]);

  let lastTime = performance.now();

  useEffect(() => {
    let animationFrameId: number;
    if (!gameStarted) {
      setBall(oldBall => {
        const newBall = { ...oldBall };
        newBall.vx = 0;
        newBall.vy = 0;
        newBall.x = 500;
        newBall.y = 500;
        return newBall;
      });
      return;
    }
    function upLoop() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      if (gameData.current?.isPaused) {
        animationFrameId = requestAnimationFrame(upLoop);
        return;
      }
      const moveAmount = RACKET_SPEED * deltaTime;

      if (keyStateRef.current.ArrowDown) {
        const speed = keyStateRef.current.Shift
          ? FINE_RACKET_SPEED
          : RACKET_SPEED;
        posRacket.current.left = Math.min(
          1000 - racketHeightRef.current.left,
          posRacket.current.left + speed,
        );
      } else if (keyStateRef.current.ArrowUp) {
        const speed = keyStateRef.current.Shift
          ? FINE_RACKET_SPEED
          : RACKET_SPEED;
        posRacket.current.left = Math.max(0, posRacket.current.left - speed);
      }

      setBall(oldBall => {
        const newBall = { ...oldBall };

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
          oldBall.x < RACKET_LEFT_HITBOX_BOUNDARY &&
          oldBall.y > posRacket.current.left &&
          oldBall.y < posRacket.current.left + racketHeightRef.current.left &&
          fail.current === false
        ) {
          newBall.x = RACKET_LEFT_HITBOX_BOUNDARY;

          newBall.speed += SPEED_INCREASE;
          const racketCenter =
            posRacket.current.left + racketHeightRef.current.left / 2;
          const relativePostion = newBall.y - racketCenter;
          let proportion = relativePostion / (racketHeightRef.current.left / 2);
          proportion = Math.max(Math.min(proportion, 0.9), -0.9);
          newBall.vy = proportion;
          newBall.vx = Math.sqrt(1 - newBall.vy * newBall.vy) * newBall.speed;
          newBall.vy *= newBall.speed;
        } else if (
          oldBall.x > RACKET_RIGHT_HITBOX_BOUNDARY &&
          oldBall.y > posRacket.current.right &&
          oldBall.y < posRacket.current.right + racketHeightRef.current.right &&
          fail.current === false
        ) {
          newBall.x = RACKET_RIGHT_HITBOX_BOUNDARY;
          newBall.speed += SPEED_INCREASE;
          const racketCenter =
            posRacket.current.right + racketHeightRef.current.right / 2;
          const relativePostion = newBall.y - racketCenter;
          let proportion =
            relativePostion / (racketHeightRef.current.right / 2);
          proportion = Math.max(Math.min(proportion, 0.9), -0.9);
          newBall.vy = proportion;
          newBall.vx = Math.sqrt(1 - newBall.vy * newBall.vy) * newBall.speed;
          newBall.vy *= newBall.speed;
          newBall.vx = -newBall.vx;
        } else if (
          oldBall.x > RACKET_RIGHT_HITBOX_BOUNDARY ||
          oldBall.x < RACKET_LEFT_HITBOX_BOUNDARY
        ) {
          fail.current = true;
        }

        newBall.x += newBall.vx * deltaTime;
        newBall.y += newBall.vy * deltaTime;

        if (
          Math.sign(newBall.vx) === Math.sign(gameData.current!.ball.vx) ||
          newBall.vx === 0 ||
          gameData.current!.ball.vx === 0
        ) {
          newBall.vx = gameData.current!.ball.vx;
        }

        if (
          Math.sign(newBall.vy) === Math.sign(gameData.current!.ball.vy) ||
          newBall.vy === 0 ||
          gameData.current!.ball.vy === 0
        ) {
          newBall.vy = gameData.current!.ball.vy;
        }
        if (
          Math.abs(newBall.x - gameData.current!.ball.x) > POSITION_THRESHOLD ||
          Math.abs(newBall.y - gameData.current!.ball.y) > POSITION_THRESHOLD
        ) {
          fail.current = false;
          newBall.x = gameData.current!.ball.x;
          newBall.y = gameData.current!.ball.y;
          newBall.vx = gameData.current!.ball.vx;
          newBall.vy = gameData.current!.ball.vy;
          newBall.speed = gameData.current!.ball.speed;
        }

        return newBall;
      });
      if (gameData.current!.winner == null) {
        animationFrameId = requestAnimationFrame(upLoop);
      } else {
        lastGameInfo.current.winnerName = gameData.current!.winner;

        if (gameData.current!.winner === gameData.current!.player1Username) {
          lastGameInfo.current.win = !gameData.current!.isPlayerRight;
          lastGameInfo.current.looserName = gameData.current!.player2Username;
        } else {
          lastGameInfo.current.win = gameData.current!.isPlayerRight;
          lastGameInfo.current.looserName = gameData.current!.player1Username;
        }
        setShowEndGame(true);
      }
    }
    upLoop();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
    <GameWrapper>
      {ShowEndGame && (
        <EndGame
          setCurrentPage={setCurrentPage}
          lastGameInfo={lastGameInfo}
          socket={socket}
        />
      )}
      {!gameStarted && <CountDown />}
      <StatutBar
        playersInfo={playerInfo ? playerInfo : undefined}
        scorePlayerLeft={scorePlayers.current.left}
        scorePlayerRight={scorePlayers.current.right}
        bonusActive={bonus || (gameStarted && gameData?.current!.bonusMode)}
        bonusIsLoading={bonusIsLoading.current}
        bonusName={bonusValueRef.current}
      />
      <Playground id="playground">
        <Racket
          posY={posRacket.current.left}
          height={racketHeightRef.current.left}
          type={'left'}
        >
          {laser.current.left && <Laser type={'left'} />}
        </Racket>

        <Ball
          posX={ball.x * (gameDimensions.current.width / 1000)}
          posY={ball.y * (gameDimensions.current.height / 1000)}
          electricity={gameData?.current?.ballElectricity}
        />
        {gameStarted && gameData?.current!.bonusMode && (
          <Bonus
            bonus={gameData.current.bonus}
            posX={
              bonusPositionRef?.current?.x
                ? bonusPositionRef.current.x *
                  (gameDimensions.current.width / 1000)
                : -1
            }
            posY={
              bonusPositionRef?.current?.y
                ? bonusPositionRef.current.y *
                  (gameDimensions.current.height / 1000)
                : -1
            }
          />
        )}

        <Racket
          posY={posRacket.current.right}
          height={racketHeightRef.current.right}
          type={'right'}
        >
          {laser.current.right && <Laser type={'right'} />}
        </Racket>

        {gameData.current?.isPaused && <DisconnectCountDown />}
        {bonusValueRef.current && (
          <p className="text-white  animate-pulse text-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            Press Espace to activate bonus
          </p>
        )}
      </Playground>
    </GameWrapper>
  );
}

export default Game;
