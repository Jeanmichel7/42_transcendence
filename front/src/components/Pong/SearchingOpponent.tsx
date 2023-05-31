import React from 'react';
import styled, { keyframes } from 'styled-components';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from './Interface';
import { StyledButton } from './Lobby';
const dotAnimation = keyframes`
  0%, 80%, 100% { 
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`;

const SearchingWrapper = styled.div`
  left: 50%;
  top: 50%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  padding-bottom: 2rem;
`;

// Crée un composant Dot qui utilise l'animation
const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.5rem;
  animation: ${dotAnimation} 1s infinite ease-in-out both;
`;

const LoadingDotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot1 = styled(Dot)`
  animation-delay: -0.32s;
`;

const Dot2 = styled(Dot)`
  animation-delay: -0.16s;
`;

function SearchingOpponent({
  socket,
  setCurrentPage,
}: Socket<ServerToClientEvents, ClientToServerEvents> &
  React.Dispatch<React.SetStateAction<string>>) {
  socket.emit('searchOpponent', 84, 'sa');
  return (
    <SearchingWrapper>
      <DotWrapper>
        <Dot1 />
        <Dot2 />
        <Dot />
      </DotWrapper>
      <StyledButton
        onClick={() => {
          socket.emit('searchOpponent', 'cancel');
          setCurrentPage('lobby');
        }}
      >
        Cancel
      </StyledButton>
    </SearchingWrapper>
  );
}
export default SearchingOpponent;
