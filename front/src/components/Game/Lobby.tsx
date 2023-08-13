import styled, { keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';

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
  font-weight: bold;
  text-align: center;
  padding: 1rem;
  border-radius: 3rem;
  transition: color 0.2s ease;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    height: 5rem;
    width: 5rem;
    background-color: #fff;
    border-radius: 3rem;
    transition: width 0.2s ease;
    z-index: -1;
    visibility: ${props => (props.activateEffect ? 'visible' : 'hidden')};
    left: -50%;
  }

  &:hover {
    ${props =>
      props.activateEffect &&
      `
    color: var(--color-primary);
      &::before {
        width: 200%;
      }
    `}
  }
`;

interface ButtonWrapperProps {
  animation: boolean;
}
export const ButtonWrapper = styled.div<ButtonWrapperProps>`
  top: 20%;
  height: 60%;
  width: 30%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  position: absolute;
  transform: translate(-50%, 0%);
  animation: ${props => (props.animation ? fadeIn : '')} 1s ease-out;
  left: 50%;
  z-index: 10;
  @media (max-width: 768px) {
    width: 50%;
  }
  @media (max-width: 420px) {
    width: 80%;
  }
`;

interface StyledCircleProps {
  pos: string;
}
const StyledCircle = styled.div<StyledCircleProps>`
  position: absolute;
  height: 5rem;
  width: 5rem;
  background-color: #fff;
  border-radius: 3rem;
  z-index: 1;
  left: -50%;
  transition: top 0.2s ease;
  ${props => {
    return props.pos === 'top' ? 'top: 0%;' : ' top: calc(100% - 5rem);';
  }}
`;

interface LobbyProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  // socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  socket: any;
  setBonus: React.Dispatch<React.SetStateAction<boolean>>;
}

function Lobby({ setCurrentPage, socket, setBonus }: LobbyProps) {
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
  return (
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
          socket.emit('userGameStatus', 'searchNormal', (response: string) => {
            if (response === 'error') {
              setCurrentPage('lobby');
            }
          });
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
  );
}

export default Lobby;
