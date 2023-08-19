import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useCallback, useState } from 'react';
import { getFriends, getBlockedUsers } from '../api/relation';
import { getUserData } from '../api/user';
import { reduxSetConversationList } from '../store/convListSlice';
import { reduxSetNotifications } from '../store/notificationSlice';
import {
  setLogged,
  setUser,
  reduxSetFriends,
  reduxSetUserBlocked,
} from '../store/userSlice';
import {
  NotificationInterface,
  ConversationInterface,
  ApiErrorResponse,
  UserActionInterface,
  UserInterface,
} from '../types';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

const slideInFromBottom = keyframes`{
  0% {
    transform: translateY(200%);
  }
  100% {
    transform: translateY(0);
  }
}`;

const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;

const slideInFromRight = keyframes`
    0% {
      transform: translateX(200%);
    }
    100% {
      transform: translateX(0);
    }
  `;

const PingPongText = styled.span`
  position: absolute;
  right: 15vw;
  bottom: 15vh;
  font-size: 2em;
  color: #ffffff;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  animation: ${slideInFromRight} 2s ease-out 1s forwards;
  transform: translateX(200%);
`;

const TitleWrapper = styled.div`
  position: relative;
  left: 10vw;
  top: 20vh;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 10vw;
  animation: ${slideInFromBottom} 2s ease-out forwards;
  color: #f4def8;
  margin-right: 5vw;
  margin-bottom: 2vh;

  @media (max-width: 768px) {
    font-size: 8em;
    margin-right: 0;
    position: absolute;
    bottom: 70%;
  }
`;

export const animationCircle = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-150%, -50%);
  }
`;

export const TransitionCircle = styled.span<{ expand: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(${props => (props.expand ? '-50%' : '-150%')}, -50%);
  animation: ${animationCircle} 3s ease-out;
  width: 200vh;
  height: 200vh;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
  transition: transform 1s ease-out;
`;

interface CircleProps {
  expand: boolean;
}

const BigCircle = styled.span<CircleProps & { hovered: boolean }>`
  position: absolute;
  left: 100%;
  top: 100%;
  transform: translate(-50%, -50%)
    scale(${props => (props.expand ? 2.5 : props.hovered ? 0.8 : 0.4)});
  opacity: ${props => (props.expand ? 1 : props.hovered ? 0.5 : 0.02)};
  width: 100vh;
  height: 100vh;
  border-radius: 50%;
  background-color: white;
  z-index: 2;
  transition: transform 1s ease-out, opacity 1s ease-out;
`;

const StyledLink = styled(({ expand, ...props }) => <Link {...props} />)`
  position: relative;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem 1rem;
  width: 10rem;
  border: 2px solid #fff;
  border-radius: 2rem;

  animation: ${fadeIn} 2s ease-out 1s forwards;
  opacity: 0;

  overflow: hidden;
  transition: color 0.3s ease;
  z-index: 10;

  @media (max-width: 768px) {
    animation: ${fadeIn} 2s ease-out 1s forwards;
    font-size: 1.5em;
    padding: 0.5em 1em;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #fff;
    transition: width 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: ${props => (!props.expand ? '#000' : '#fff')};
    &::before {
      width: 100%;
    }
  }
`;

const LoginWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
`;

export default function Login() {
  const [isHovered, setIsHovered] = useState(false);
  const [expand, setExpand] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchData = useCallback(
    async function <T extends UserInterface | UserInterface[]>(
      apiFunction: () => Promise<T | ApiErrorResponse>,
      action: (payload: T) => UserActionInterface,
    ): Promise<void> {
      const result: T | ApiErrorResponse = await apiFunction();
      if ('error' in result) {
        dispatch(setErrorSnackbar(result));
      } else {
        dispatch(action(result));
      }
    },
    [dispatch],
  );

  //save user data in redux
  const saveUserData = useCallback(
    async function (id: number) {
      dispatch(setLogged(true));
      dispatch(
        reduxSetNotifications(
          localStorage.getItem('notifications' + id)
            ? JSON.parse(localStorage.getItem('notifications' + id) as string)
            : ([] as NotificationInterface[]),
        ),
      );
      dispatch(
        reduxSetConversationList(
          localStorage.getItem('conversationsList' + id)
            ? JSON.parse(
                localStorage.getItem('conversationsList' + id) as string,
              )
            : ([] as ConversationInterface[]),
        ),
      );
      await fetchData(getUserData, setUser);
      await fetchData(getFriends, reduxSetFriends);
      await fetchData(getBlockedUsers, reduxSetUserBlocked);
    },
    [dispatch, fetchData],
  );

  const handleConnection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const width = 450;
    const height = 600;
    const left = Math.floor(window.innerWidth / 2 - width / 2) + window.screenX;
    const top =
      Math.floor(window.innerHeight / 2 - height / 2) + window.screenY;
    const newWindow = window.open(
      '/connection',
      '_blank',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
        scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    );
    if (!newWindow) return console.warn('erreur new windows  ');

    window.addEventListener('message', async event => {
      if (event.source !== newWindow) return;

      if (event.data.msg === 'resize') {
        const newX =
          Math.floor(window.innerWidth / 2 - event.data.width / 2) +
          window.screenX;
        newWindow.resizeTo(event.data.width, event.data.height);
        newWindow.moveTo(newX, top);
        return;
      }

      if (event.data.msg === 'user connected') {
        setExpand(true);
        if (event.data.id != -1) await saveUserData(event.data.id);
        newWindow.close();
        navigate('/game');
      }
    });
  };

  return (
    <LoginWrapper>
      <TransitionCircle expand={expand} />
      <BigCircle hovered={isHovered} expand={expand} />

      <TitleWrapper>
        <Title>PONG</Title>
        <StyledLink
          onClick={handleConnection}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          expand={expand}
        >
          Login
        </StyledLink>
      </TitleWrapper>
      <PingPongText>Pong! Le jeu qui ping</PingPongText>
    </LoginWrapper>
  );
}
