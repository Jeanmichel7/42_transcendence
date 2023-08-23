import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ButtonWrapper, StyledButton } from './Lobby';
import { dotAnimation } from './Utils';
import { Socket } from 'socket.io-client';
import keyDiagram from '../../assets/keyDiagram.png';

interface SearchingOpponentProps {
  socket: Socket;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  bonus: boolean;
}

interface StyledCircleProps {
  top: string;
}
const StyledCircle = styled.div<StyledCircleProps>`
  height: 5rem;
  width: 5rem;
  background-color: #fff;
  border-radius: 3rem;
  z-index: 1;
  transition: top 0.2s ease;
  ${props => {
    return props.top === 'top' ? 'top: 0%;' : ' top: calc(100% - 5rem);';
  }}
  animation: ${dotAnimation} 2s infinite ease-in-out both;
`;

const StyledCircle2 = styled(StyledCircle)`
  animation-delay: -0.16s;
`;

const StyledCircle3 = styled(StyledCircle)`
  animation-delay: -0.32s;
`;

const FadingAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FadingAnimationControlScheme = keyframes`
  0% {
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
`;

const FadeInControlScheme = styled.img`
  opacity: 0;
  width: 25%;
  height: auto%;
  animation: ${FadingAnimationControlScheme} 1s forwards;
`;

interface StyledButtonOrderProps {
  order: string;
}

const StyledButtonOrder = styled(StyledButton)<StyledButtonOrderProps>`
  animation: ${FadingAnimation} 1s ease-in-out forwards;
  &::before {
    opacity: 0;
    transition: width 0.2s ease, opacity 1s ease-in-out;
  }
  &:hover::before {
    opacity: 1;
  }
  order: ${props => props.order};
`;

const reduceSize = keyframes`
  0% {
    width : 139%;
  }
  30% {
    width: 139%;
  }
  100% {
    width: 5rem;
  }
`;

const reduceSizeMobile = keyframes`
  0% {
    width : 119%;
  }
  30% {
    width: 119%;
  }
  100% {
    width: 5rem;
  }
`;
const expandEffect = keyframes`
0% {
  transform: scaleX(1) scaleY(1)
  opacity: 0;
}
30% {
  transform: scaleX(1.4) scaleY(1.6);
  opacity: 0;
}

`;
const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% + 40%);
  margin-left: -20%;
  @media (max-width: 768px) {
    width: calc(100% + 20%);
    margin-left: -10%;
  }
`;

interface StyledOblongProps {
  top: string;
  ref: React.RefObject<HTMLButtonElement>;
}
export const StyledOblong = styled.button<StyledOblongProps>`
  position: absolute;
  height: 5rem;
  animation: ${reduceSize} 1s ease-out forwards;
  background-color: #fff;
  border-radius: 3rem;
  transition: width 0.2s ease;
  z-index: 1;
  visibility: visible;
  left: -20%;
  @media (max-width: 768px) {
    left: -10%;
    animation: ${reduceSizeMobile} 1s ease-out forwards;
  }
  ${props => {
    return props.top === 'top' ? 'top: 0%;' : ' top: calc(100% - 5rem);';
  }}

  &::before {
    content: '';
    width: 100%;
    top: 0;
    left: 0;
    border-radius: 3rem;
    height: 5rem;
    position: absolute;
    background-color: blue;
    z-index: 2;
    animation: ${expandEffect} 1s ease-out forwards;
  }
`;

function SearchingOpponent({
  socket,
  setCurrentPage,
  bonus,
}: SearchingOpponentProps) {
  const [loadingDot, setLoadingDot] = useState(false);
  const myRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const node = myRef.current;

    function handleAnimationEnd() {
      setLoadingDot(true);
    }

    if (node) node.addEventListener('animationend', handleAnimationEnd);

    return () => {
      if (node) node.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <div className="h-full  w-full ">
      <div className="h-1/6 text-center flex items-center justify-center mb-10"></div>
      <ButtonWrapper animation={true}>
        <StyledButtonOrder
          order={bonus ? '0' : '1'}
          activateEffect={loadingDot}
          onClick={() => {
            socket.emit('userGameStatus', 'cancel');
            setCurrentPage('lobby');
          }}
        >
          Cancel
        </StyledButtonOrder>
        {loadingDot ? (
          <StyledContainer>
            <StyledCircle3 top={bonus ? 'bottom' : 'top'} />
            <StyledCircle2 top={bonus ? 'bottom' : 'top'} />
            <StyledCircle top={bonus ? 'bottom' : 'top'} />
          </StyledContainer>
        ) : (
          <div>
            <StyledOblong
              ref={myRef}
              top={bonus ? 'bottom' : 'top'}
            ></StyledOblong>
          </div>
        )}
      </ButtonWrapper>
      <FadeInControlScheme
        src={keyDiagram}
        alt="key diagram"
        className="w-1/4 mx-auto"
      />
    </div>
  );
}
export default SearchingOpponent;
