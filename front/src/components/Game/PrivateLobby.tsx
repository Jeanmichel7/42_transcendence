import styled from 'styled-components';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  PlayerStatus,
} from './Interface';
import { StyledButton } from './Lobby';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserInterface, NotificationInterface } from '../../types';
import {
  reduxReadNotification,
  reduxRemoveNotification,
} from '../../store/notificationSlice';
const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  position: absolute;
`;

interface StyledValidationButtonProps {
  ready: boolean;
}

export const StyledValidationButton = styled.button<StyledValidationButtonProps>`
  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 1em;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe,
    0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
  background-color: ${props => (props.ready ? 'grey' : 'defaultColor')};
  color: ${props => (props.ready ? '#fff' : 'defaultColor')};
  text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe,
    0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;
`;

interface ChoiceIndicatorProps {
  side: string | undefined;
  mode: string | undefined;
}
const ChoiceIndicator = styled.div<ChoiceIndicatorProps>`
  width: 20px;
  height: 20px;
  background-color: white;
  left: ${props => (props.side === 'left' ? '12%' : '85%')};
  top: ${props => (props.mode === 'bonus' ? '50%' : '15%')};
  border-radius: 50%;
  position: absolute;
  color: blue;
`;

interface LobbyProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  gameId: string;
  isPlayer1: boolean;
}

function PrivateLobby({ socket, gameId, isPlayer1 }: LobbyProps) {
  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );
  const notifications: NotificationInterface[] = useSelector(
    (state: RootState) => state.notification.notifications,
  );
  const dispatch = useDispatch();
  const [opponentStatus, setOpponentStatus] = useState<PlayerStatus>();
  const [mode, setMode] = useState<string>('normal');
  const [ready, setReady] = useState<boolean>(false);

  //delete notif if in lobby
  useEffect(() => {
    if (!gameId) return;
    notifications.forEach((notif: NotificationInterface) => {
      if (notif.type === 'gameInvite' || notif.type === 'gameInviteAccepted') {
        const gameIdNotif = notif.invitationLink?.split('/game?id=')[1];
        if (gameIdNotif === gameId) {
          dispatch(reduxReadNotification(notif));
          dispatch(
            reduxRemoveNotification({
              notifId: notif.id,
              userId: userData.id,
            }),
          );
        }
      }
    });
    console.log('Notifictions: ', notifications);
  }, [dispatch, gameId, notifications, userData.id]);

  useEffect(() => {
    socket.on('privateLobby', (opponentNewStatus: PlayerStatus) => {
      setOpponentStatus(opponentNewStatus);
    });
    return () => {
      socket.off('privateLobby');
    };
  }, []);

  useEffect(() => {
    const data = {
      gameId: +gameId,
      mode: mode,
      ready: ready,
      player1: isPlayer1,
    };
    socket.emit('privateLobby', data);
  }, [mode, ready]);

  return (
    <ButtonWrapper>
      <StyledButton
        onClick={() => {
          setMode('normal');
        }}
      >
        Normal Mode
      </StyledButton>
      <StyledButton
        onClick={() => {
          setMode('bonus');
        }}
      >
        Bonus Mode
      </StyledButton>
      <ChoiceIndicator side={'right'} mode={opponentStatus?.mode} />
      <ChoiceIndicator side={'left'} mode={mode} />
      <StyledValidationButton
        ready={ready}
        onClick={() => {
          if (ready) {
            setReady(false);
          } else {
            setReady(true);
          }
        }}
      >
        Confirm Selection
      </StyledValidationButton>
    </ButtonWrapper>
  );
}

export default PrivateLobby;
