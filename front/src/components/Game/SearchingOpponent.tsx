import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from './Interface';
import { ButtonWrapper, StyledButton } from './Lobby';
import { DotWaitings, dotAnimation } from './Utils';
interface SearchingOpponentProps {
  // socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  socket: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  bonus: boolean;
}

const StyledCircle = styled.div`
  position: absolute;
  height: 5rem;
  width: 5rem;
  background-color: #fff;
  border-radius: 3rem;
  z-index: 1;
  left: ${(props) => props.position};
  transition: top 0.2s ease;
  ${(props) => {
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

const FadingAnnimation = keyframes`
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

const StyledButtonOrder = styled(StyledButton)`
  animation: ${FadingAnnimation} 1s ease-in-out forwards;
  &::before {
    opacity: 0;
    transition: width 0.2s ease, opacity 1s ease-in-out;
  }
  &:hover::before {
    opacity: 1;
  }
  order: ${(props) => props.order};
`;

const reduceSize = keyframes`
  0% {
    width : 200%;
  }
  30% {
    width: 200%;
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
export const StyledOblong = styled.button`
  position: absolute;
  height: 5rem;
  animation: ${reduceSize} 1s ease-out forwards;
  background-color: #fff;
  border-radius: 3rem;
  transition: width 0.2s ease;
  z-index: 1;
  visibility: visible;
  left: -50%;
  ${(props) => {
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
  const myRef = useRef();
  useEffect(() => {
    const node = myRef.current;

    function handleAnimationEnd() {
      setLoadingDot(true);
      // Vous pouvez faire quelque chose ici à la fin de l'animation
    }

    if (node) node.addEventListener('animationend', handleAnimationEnd);

    // Assurez-vous de nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      if (node) node.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []); // Cette dépendance vide indique que cet effet ne fonctionne qu'au montage et au démontage
  console.log(bonus);

  return (
    <div className="flex flex-col justify-center items-center  w-full ">
      <ButtonWrapper>
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
          <div>
            <StyledCircle3 top={bonus ? 'bottom' : 'top'} position={'-50%'} />
            <StyledCircle2 top={bonus ? 'bottom' : 'top'} position={'37%'} />
            <StyledCircle top={bonus ? 'bottom' : 'top'} position={'125%'} />
          </div>
        ) : (
          <div>
            <StyledOblong
              ref={myRef}
              top={bonus ? 'bottom' : 'top'}
            ></StyledOblong>
          </div>
        )}
      </ButtonWrapper>
    </div>
  );
}
export default SearchingOpponent;
