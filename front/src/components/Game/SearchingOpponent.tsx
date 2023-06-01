import React from 'react';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from './Interface';
import { StyledButton } from './Lobby';
import { DotWaitings } from './Utils';

const SearchingWrapper = styled.div`
  left: 50%;
  top: 50%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function SearchingOpponent({
  socket,
  setCurrentPage,
}: Socket<ServerToClientEvents, ClientToServerEvents> &
  React.Dispatch<React.SetStateAction<string>>) {
  socket.emit('searchOpponent', 84, 'sa');
  return (
    <SearchingWrapper>
      <DotWaitings />
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
