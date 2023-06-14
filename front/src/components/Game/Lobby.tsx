import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from './Interface';

export const StyledButton = styled.button`
 border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  box-shadow: 0 0 .2rem #fff,
            0 0 .2rem #fff,
            0 0 2rem #bc13fe,
            0 0 0.8rem #bc13fe,
            0 0 2.8rem #bc13fe,
            inset 0 0 1.3rem #bc13fe; 
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
  &:hover {
    background-color: grey;
    color: #fff;
  }
    text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #bc13fe,
    0 0 82px #bc13fe,
    0 0 92px #bc13fe,
    0 0 102px #bc13fe,
    0 0 151px #bc13fe;
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
