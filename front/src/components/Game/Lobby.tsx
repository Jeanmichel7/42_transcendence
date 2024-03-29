import styled, { keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { GameCard } from '../../pages/Pong';
import { ranksImages } from '../../utils/rankImages';
import '../../utils/animation.css';
import { ClientToServerEvents, ServerToClientEvents } from './Interface';
import { Socket } from 'socket.io-client';
import { Sticker } from '../../utils/StyledTitle';
import DisplayImg from '../../utils/displayImage';
import keyDiagram from '../../assets/keyDiagram.png';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface StyledButtonProps {
  activateEffect?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  position: relative;
  color: #fff;
  text-decoration: none;
  width: 100%;
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  padding: 1rem;
  border-radius: 3rem;
  font-family: 'Alegreya Sans SC', sans-serif;
  transition: color 0.2s ease;
  z-index: 10;

  &::before {
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe,
      0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
    content: '';
    position: absolute;
    top: 0;
    height: 5rem;
    width: 5rem;
    background-color: #000;
    border-radius: 3rem;
    transition: width 0.2s ease;
    z-index: -1;
    visibility: ${props => (props.activateEffect ? 'visible' : 'hidden')};
    left: -20%;
    @media (max-width: 768px) {
      left: -10%;
    }
  }

  &:hover {
    ${props =>
      props.activateEffect &&
      `
      &::before {
        width: 139%;
      }
      @media (max-width: 768px) {
        &::before {
          width: 119%;
        }
    `}
  }
`;

interface ButtonWrapperProps {
  animation: boolean;
}
export const ButtonWrapper = styled.div<ButtonWrapperProps>`
  height: 30%;
  width: 30%;
  margin-top: 5%;
  margin-bottom: 5%;
  @media (max-height: 600px) {
    margin-top: 2%;
    margin-bottom: 2%;
  }
  display: flex;
  position: relative;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  transform: translate(-50%, 0%);
  animation: ${props => (props.animation ? fadeIn : '')} 1s ease-out;
  left: 50%;
  z-index: 10;
  @media (max-width: 1280px) {
    width: 40%;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
`;

interface StyledCircleProps {
  pos: string;
}
const StyledCircle = styled.div<StyledCircleProps>`
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe,
    0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
  position: absolute;
  height: 5rem;
  width: 5rem;
  background-color: #000;
  border-radius: 3rem;
  z-index: 1;
  left: -20%;
  @media (max-width: 768px) {
    left: -10%;
  }
  transition: top 0.2s ease;
  ${props => {
    return props.pos === 'top' ? 'top: 0%;' : ' top: calc(100% - 5rem);';
  }}
`;

interface LobbyProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  setBonus: React.Dispatch<React.SetStateAction<boolean>>;
  lobbyData: GameCard[];
  setGameIdSpectate: React.Dispatch<React.SetStateAction<number | undefined>>;
}

function Lobby({
  setCurrentPage,
  socket,
  setBonus,
  lobbyData,
  setGameIdSpectate,
}: LobbyProps) {
  const circlePostion = useRef('top');
  const [enableEffect, setEnableEffect] = useState({
    top: true,
    bottom: false,
  });
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circle = circleRef.current;

    const handleTransitionEnd = () => {
      if (circle) {
        if (circlePostion.current === 'top') {
          setEnableEffect({ top: true, bottom: false });
        } else {
          setEnableEffect({ top: false, bottom: true });
        }
      }
    };

    if (circle) {
      circle.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      if (circle) {
        circle.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, []);

  const COLUMNS = 3;
  const fakeCardsCount =
    lobbyData.length <= 2 ? COLUMNS - (lobbyData.length % COLUMNS) : 0;
  const fakeCards = Array.from({ length: fakeCardsCount });
  const handleCardClick = (gameId: number) => {
    setGameIdSpectate(gameId);
    setCurrentPage('spectate');
  };

  return (
    <div className=" w-full h-full">
      <div className="h-1/6 text-center flex items-center justify-center mb-10">
        <Sticker dataText="Game Mode" />
      </div>

      <ButtonWrapper animation={true}>
        <StyledCircle pos={circlePostion.current} ref={circleRef} />
        <StyledButton
          activateEffect={enableEffect.top}
          onMouseOver={() => {
            if (circlePostion.current != 'top') {
              setEnableEffect({ top: false, bottom: false });
              circlePostion.current = 'top';
            }
          }}
          onClick={() => {
            socket.emit(
              'userGameStatus',
              'searchNormal',
              (response: string) => {
                if (response === 'error') {
                  setCurrentPage('lobby');
                }
              },
            );
            setBonus(false);
            setCurrentPage('searchOpponent');
          }}
        >
          Normal Mode
        </StyledButton>

        <StyledButton
          activateEffect={enableEffect.bottom}
          onMouseOver={() => {
            if (circlePostion.current != 'bottom') {
              setEnableEffect({ top: false, bottom: false });
              circlePostion.current = 'bottom';
            }
          }}
          onClick={() => {
            socket.emit('userGameStatus', 'searchBonus', (response: string) => {
              if (response === 'error') {
                setCurrentPage('lobby');
              }
            });
            setBonus(true);
            setCurrentPage('searchOpponent');
          }}
        >
          Bonus Mode
        </StyledButton>
      </ButtonWrapper>

      <div className="grid xl:grid-cols-3 items-center h-2/5 justify-items-center relative w-full">
        {lobbyData.map(card => {
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className=" animate-vibration bg-white rounded-lg p-6 m-4 w-72 transition-transform transform scale-100 hover:scale-105 shadow-custom hover:bg-gray-200 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <DisplayImg
                    src={card.player1Avatar}
                    alt={card.player1Username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{card.player1Username}</p>
                    <img
                      src={ranksImages[card.player2Rank]}
                      alt={card.player2Rank}
                      className="w-10 h-10 mr-4"
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">{card.player1Score}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DisplayImg
                    src={card.player2Avatar}
                    alt={card.player2Username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{card.player2Username}</p>
                    <img
                      src={ranksImages[card.player2Rank]}
                      alt={card.player2Rank}
                      className="w-10 h-10 mr-4"
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">{card.player2Score}</div>
              </div>
            </div>
          );
        })}
        {fakeCards.map((_, index) => (
          <div
            key={index}
            className={`border border-dashed rounded-lg h-44 m-4 w-72 bg-transparent ${
              index > 0 || lobbyData.length > 0 ? 'hidden xl:block' : ''
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
