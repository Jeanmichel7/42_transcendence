import styled, { keyframes } from 'styled-components';
// import { StyledButton } from './Lobby';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { Smiley } from './SmileyWrapper';
import './font.css';
import { ClientToServerEvents, ServerToClientEvents } from './Interface';
import { Socket } from 'socket.io-client';

const fadeIn = keyframes`
0% {
  opacity: 0;
}
75% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

export const StyledButton = styled.button`
  align-items: center;
  appearance: none;
  background-clip: padding-box;
  background-color: initial;
  background-image: none;
  border-style: none;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  flex-direction: row;
  flex-shrink: 0;
  font-family: Eina01, sans-serif;
  font-size: 16px;
  font-weight: 800;
  justify-content: center;
  line-height: 24px;
  margin: 0;
  min-height: 64px;
  outline: none;
  overflow: visible;
  padding: 19px 26px;
  pointer-events: auto;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  width: auto;
  word-break: keep-all;
  z-index: 0;

  @media (min-width: 768px) {
    padding: 19px 32px;
  }

  &:before,
  &:after {
    border-radius: 80px;
  }

  &:before {
    background-image: linear-gradient(92.83deg, #1976d2 0, #132ef9 100%);
    content: '';
    display: block;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -2;
  }

  &:after {
    background-color: initial;
    background-image: linear-gradient(#0f1454 0, #000000 100%);
    bottom: 4px;
    content: '';
    display: block;
    left: 4px;
    overflow: hidden;
    position: absolute;
    right: 4px;
    top: 4px;
    transition: all 100ms ease-out;
    z-index: -1;
  }

  &:hover:not(:disabled):before {
    background: linear-gradient(
      92.83deg,
      rgb(38, 147, 255) 0%,
      rgb(19, 96, 249) 100%
    );
  }

  &:hover:not(:disabled):after {
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    transition-timing-function: ease-in;
    opacity: 0;
  }

  &:active:not(:disabled) {
    color: #ccc;
  }

  &:active:not(:disabled):before {
    background-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2)
      ),
      linear-gradient(92.83deg, #ff7426 0, #f93a13 100%);
  }

  &:active:not(:disabled):after {
    background-image: linear-gradient(#541a0f 0, #0c0d0d 100%);
    bottom: 4px;
    left: 4px;
    right: 4px;
    top: 4px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.24;
  }
`;

const LooseWrapper = styled.div`
  position: absolute;
  color: black;
  align-items: center;
  height: 100%;
  justify-content: center;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 8s ease-out;
  overflow: hidden;
`;

const flicker = keyframes`{
  40% {
    opacity: 1;
  }
  42% {
    opacity: 0.8;
  }
  43% {
    opacity: 1;
  }
  45% {
    opacity: 0.2;
  }
  46% {
    opacity: 1;
  }
}`;

const buzz = keyframes`
{
  70% {
    opacity: 0.80;
  }
}`;
const StyledNeonH1 = styled.h1`
  color: #fff;
  -webkit-animation: ${buzz} 0.1s infinite alternate;
  font-size: 3rem;
  text-shadow: 0 0 0 transparent, 0 0 10px #2695ff,
    0 0 20px rgba(38, 149, 255, 0.5), 0 0 40px #2695ff, 0 0 100px #2695ff,
    0 0 200px #2695ff, 0 0 300px #2695ff, 0 0 500px #2695ff;
`;

const neonAnimationStartUp = keyframes`
0% { 
    text-shadow: none; 
    color: #000;
  }
100% { 
  color: #fff;
  text-shadow:
    0 0 10px #FF00FF,
    0 0 20px #FF00FF,
    0 0 30px #FF00FF,
    0 0 40px #FF00FF;
    border: 0.2rem solid #fff;
    border-radius: 2rem;
    padding: 0.4em;
    box-shadow: 0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem #bc13fe,
              0 0 0.8rem #bc13fe,
              0 0 2.8rem #bc13fe,
              inset 0 0 1.3rem #bc13fe; 
}
`;

const NeonSign = styled.div`
  font-size: 1em;
  position: absolute;
  left: 63%;
  top: 25%;
  rotate: 30deg;
  text-align: center;
  animation: ${neonAnimationStartUp} steps(1) 1s forwards;
  animation-delay: 1s; // The sign will start glowing after 1 second
`;

const detachAndFall = keyframes`
  0% {
    transform-origin: top left;
    transform: rotate(0deg);
  }
  25% {
    transform-origin: top left;
    transform: rotate(100deg);
  }
  50% {
    transform-origin: top left;
    transform: rotate(80deg) ;
  }
  75% {
    transform-origin: top left;
    transform: rotate(100deg) ;
  }
  100% {
    transform-origin: top left;
    transform: rotate(90deg) translateX(400%);
  }
`;

const StyledNeonH2 = styled.h2`
  color: #fff;
  animation: ${flicker} 4s infinite alternate,
    ${detachAndFall} 7s ease-in-out forwards;
  animation-delay: 9s;
  font-size: 2rem;
  text-shadow: -1px 0px 7px #fff, -1px 0px 10px #fff, -1px 0px 21px #fff,
    -1px 0px 42px #800080,
    /* Ici, je remplace #0fa par #800080 */ -1px 0px 82px #800080,
    -1px 0px 92px #800080, -1px 0px 102px #800080, -1px 0px 151px #800080;
`;

// interface setCurrentPage {
//   setLoose: React.Dispatch<React.SetStateAction<string>>;
// }

const FullScreenCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

interface LastGameInfo {
  win: boolean;
  winnerName: string;
  looserName: string;
}
interface LooseProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  lastGameInfo: React.RefObject<LastGameInfo>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}
function EndGame({ setCurrentPage, lastGameInfo }: LooseProps) {
  useEffect(() => {
    if (lastGameInfo.current && lastGameInfo.current.win) {
      setTimeout(() => {
        const myConfetti = confetti.create(
          document.getElementById('myCanvas') as HTMLCanvasElement,
          { useWorker: true, resize: true },
        );
        myConfetti({
          particleCount: 100,
          spread: 160,
        });
      }, 3500);
    }
  }, [lastGameInfo]);
  if (!lastGameInfo.current) {
    return null;
  }

  return (
    <Smiley mood={lastGameInfo.current.win ? 'happy' : 'sad'}>
      <LooseWrapper>
        {lastGameInfo.current.win ? (
          <>
            <StyledNeonH1>
              Victory !
              <br />
              Winner: <br />
              {lastGameInfo.current.winnerName}{' '}
            </StyledNeonH1>
            <NeonSign>Good Game</NeonSign>
            <FullScreenCanvas id="myCanvas"></FullScreenCanvas>
          </>
        ) : (
          <>
            <StyledNeonH1>
              Defeate
              <br />
              Winner: <br /> {lastGameInfo.current.winnerName}{' '}
            </StyledNeonH1>
            <NeonSign>Nice Try</NeonSign>
          </>
        )}
        <StyledNeonH2>Looser: {lastGameInfo.current.looserName}</StyledNeonH2>
        <StyledButton
          onClick={() => {
            setCurrentPage('lobby');
          }}
        >
          Return to Lobby
        </StyledButton>
      </LooseWrapper>
    </Smiley>
  );
}

export default EndGame;
