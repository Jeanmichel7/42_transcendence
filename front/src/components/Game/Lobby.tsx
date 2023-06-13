import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from './Interface';

export const StyledButton = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    background-color: grey;
  }
`;

const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
`;

function Lobby({
  setCurrentPage, socket 
}: React.Dispatch<React.SetStateAction<string>> &  Socket<ServerToClientEvents, ClientToServerEvents>) {
  return (
    <ButtonWrapper>
      <StyledButton
        onClick={() => {
          
          socket.emit('userGameStatus', 'searchNormal',  (response) => {
            if (response === 'error')
            {
              setCurrentPage('lobby');;
               };})
          setCurrentPage('searchOpponent');
        }}
      >
        Normal Mode
      </StyledButton>
      <StyledButton
        onClick={() => {
          socket.emit('userGameStatus', 'searchBonus',  (response) => {
            if (response === 'error')
            {
              setCurrentPage('lobby');;
               };})
          setCurrentPage('searchOpponent');
        }}
      >
        Bonus Mode
      </StyledButton>
    </ButtonWrapper>
  );
}

export default Lobby;
