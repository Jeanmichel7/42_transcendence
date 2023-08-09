import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { CircleBackground } from '../utils/CircleBackground';
import { getFriends, getBlockedUsers } from '../api/relation';
import { getUserData } from '../api/user';
import { reduxSetConversationList } from '../store/convListSlice';
import { reduxSetNotifications } from '../store/notificationSlice';
import { setLogged, setUser, reduxSetFriends, reduxSetUserBlocked } from '../store/userSlice';
import { NotificationInterface, ConversationInterface, ApiErrorResponse, UserActionInterface, UserInterface } from '../types';
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

const slideInFromBottomSmallScreen = keyframes`{
  0% {
    transform: translateY(400%);
  }
  100% {
    transform: translateY(0);
  }
}`;

const slideInFromBottomLink = keyframes`{
  0% {
    transform: translateY(200%);
  }
  50% {
    transform: translateY(200%);
  }
  100% {
    transform: translateY(0);
  }
}`;

const particleContainer = styled.div`
  background-color: #f9ecd0;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  height: 200px;
  width: 80%;
  position: absolute;
  left: 20%;
  top: 20%;
  overflow: hidden;
  align-items: baseline;
  display: flex;
  flex-direction: line;
  @media (max-width: 768px) {
    flex-direction: column;
    height: 400px;
  }
`;

const Title = styled.h1`
  font-size: 8rem;
  animation: ${slideInFromBottom} 2s ease-out;
  color: #f4def8;
`;

const BigCircle = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
    scale(${(props) => (props.expand ? 2.5 : props.hovered ? 0.3 : 0.2)});
  opacity: ${(props) => (props.expand ? 1 : props.hovered ? 0.5 : 0.02)};
  width: 100vh;
  height: 100vh;
  border-radius: 50%;
  background-color: white;
  z-index: 2;
  transition: transform 1s ease-out, opacity 1s ease-out;
`;

export const animationCircle = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-150%, -50%);
  }
`;

export const TransitionCircle = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(${(props) => (props.expand ? '-50%' : '-150%')}, -50%);
  animation: ${animationCircle} 1s ease-out;
  width: 200vh;
  height: 200vh;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
  transition: transform 1s ease-out;
`;

const StyledLink = styled(({ expand, ...props }) => <Link {...props} />)`
  position: relative;
  margin-left: 2rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem 1rem;
  width: 10rem;
  border: 2px solid #fff;
  border-radius: 2rem;
  animation: ${slideInFromBottomLink} 3s ease-out;
  overflow: hidden;
  transition: color 0.3s ease;
  z-index: 10;

  @media (max-width: 768px) {
    animation: ${slideInFromBottomSmallScreen} 3s ease-out;
  }
  &::before {
    content: "";
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
    color: ${(props) => (!props.expand ? '#000' : '#fff')};
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

  const fetchData = useCallback(async function <T extends UserInterface | UserInterface[]>(
    apiFunction: () => Promise<T | ApiErrorResponse>,
    action: ((payload: T) => UserActionInterface),
  ): Promise<void> {
    const result: T | ApiErrorResponse = await apiFunction();
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      dispatch(action(result));
    }
  }, [dispatch]);

  //save user data in redux
  const saveUserData = useCallback(async function (id: number) {
    dispatch(setLogged(true));
    dispatch(reduxSetNotifications(
      localStorage.getItem('notifications' + id)
        ? JSON.parse(localStorage.getItem('notifications' + id) as string)
        : [] as NotificationInterface[],
    ));
    dispatch(reduxSetConversationList(
      localStorage.getItem('conversationsList' + id)
        ? JSON.parse(localStorage.getItem('conversationsList' + id) as string)
        : [] as ConversationInterface[],
    ));
    await fetchData(getUserData, setUser);
    await fetchData(getFriends, reduxSetFriends);
    await fetchData(getBlockedUsers, reduxSetUserBlocked);
  }, [dispatch, fetchData]);

  const handleConnection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const width = 600;
    const height = 688;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const newWindow = window.open(
      'http://localhost:3006/connection',
      '_blank',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
        scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    );
    if (!newWindow) return console.log('erreur new windows  ');

    window.addEventListener('message', async (event) => {
      if (event.source !== newWindow) return;
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
      {/*<TransitionCircle expand={expand} />
        <BigCircle hovered={isHovered} expand={expand} />
      */}
      <TitleWrapper>
        <Title>Pong</Title>
        <StyledLink
          onClick={handleConnection}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          expand={expand}
        >
          Login
        </StyledLink>
        {/* <Link to="/fakeconnection">
          <Button sx={{ my: 2, color: 'white', display: 'block' }}>
            Login Fake
          </Button>
        </Link> */}
      </TitleWrapper>
    </LoginWrapper>
  );
}
