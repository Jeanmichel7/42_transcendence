import styled from 'styled-components';
// import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { GameInterface } from '../../types';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './Interface';

export const StyledButton = styled.button`
  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 1em;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe,
    0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
  &:hover {
    background-color: grey;
    color: #fff;
  }
  text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe,
    0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;
`;

const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  position: absolute;
`;

interface LobbyProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  game: GameInterface;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

function LobbyInvitation({ setCurrentPage, game, socket }: LobbyProps) {
  useEffect(() => {
    socket.emit('joinInvitationGame', {
      gameId: game.id,
    });

    return () => {
      socket.emit('leaveInvitationGame', {
        gameId: game.id,
      });
    };
  }, [socket]);

  return (
    <ButtonWrapper>
      <StyledButton
        onClick={() => {
          socket.emit('userGameStatus', 'searchNormalInvite', response => {
            if (response === 'error') {
              setCurrentPage('lobby');
            }
          });
          setCurrentPage('searchOpponent');
        }}
      >
        Normal Mode
      </StyledButton>
      <StyledButton
        onClick={() => {
          socket.emit('userGameStatus', 'searchBonusInvite', response => {
            if (response === 'error') {
              setCurrentPage('lobby');
            }
          });
          setCurrentPage('searchOpponent');
        }}
      >
        Bonus Mode
      </StyledButton>
    </ButtonWrapper>
  );
}

export default LobbyInvitation;
