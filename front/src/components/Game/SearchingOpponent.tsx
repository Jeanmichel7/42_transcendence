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
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function SearchingOpponent({
  socket,
  setCurrentPage,
}: Socket<ServerToClientEvents, ClientToServerEvents> &
  React.Dispatch<React.SetStateAction<string>>) {

  return (
    <SearchingWrapper>
      <DotWaitings />
      <StyledButton
        onClick={() => {
          socket.emit('searchOpponent', 'cancel',);
          setCurrentPage('lobby');
        }}
      >
        Cancel
      </StyledButton>
    </SearchingWrapper>
  );
}
export default SearchingOpponent;
