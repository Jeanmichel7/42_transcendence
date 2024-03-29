import Game from '../components/Game/Game';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Socket, io } from 'socket.io-client';
import Lobby from '../components/Game/Lobby';
import SearchingOpponent from '../components/Game/SearchingOpponent';
import { Overlay } from '../components/Game/Overlay';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiErrorResponse, GameInterface } from '../types';
import { getGame } from '../api/game';
import { useDispatch, useSelector } from 'react-redux';
import {
  setErrorSnackbar,
  setPersonalizedErrorSnackbar,
} from '../store/snackbarSlice';
import { RootState } from '../store';
import PrivateLobby from '../components/Game/PrivateLobby';
import { activateEffect, desactivateEffect } from '../store/gameSlice';
import GameSpectator from '../components/Game/Spectator';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { IconButton } from '@mui/material';
import ChatWrapper from '../components/Game/Chat/ChatWrapper';
import { TransitionCircle } from './Login';

type GameWrapperProps = {
  chatOpen: boolean;
};

export const GameWrapper = styled.div<GameWrapperProps>`
  width: ${props => (props.chatOpen ? '75%' : '100%')};
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

export interface GameCard {
  id: number;
  player1Username: string;
  player2Username: string;
  player1Avatar: string;
  player2Avatar: string;
  player1Rank: string;
  player2Rank: string;
  player1Score: number;
  player2Score: number;
}

function Pong() {
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const [connectStatus, setConnectStatus] = useState('disconnected');
  const [currentPage, setCurrentPage] = useState<string>('lobby');
  const { userData } = useSelector((state: RootState) => state.user);
  const lastGameInfo = useRef({} as any);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [isSpectator, setIsSpectator] = useState(false);
  const [bonus, setBonus] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameIdInvit = searchParams.get('id');
  const [gameIdInvitSpectate, setGameIdSpectate] = useState<
    undefined | number
  >();
  const [showOverlay, setShowOverlay] = useState(false);
  const [lobbyData, setLobbyData] = useState<GameCard[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [pageContent, setPageContent] = useState<ReactNode>(null);
  const location = useLocation();
  const cameFromLogin = location.state?.fromLogin;

  const toggleChat = () => {
    setChatOpen(prevState => !prevState);
  };

  useEffect(() => {
    if (!gameIdInvit || !userData.id || userData.id == -1) return;

    const fetchGame = async () => {
      const retFetchGame: GameInterface | ApiErrorResponse = await getGame(
        parseInt(gameIdInvit),
      );
      if ('error' in retFetchGame) {
        dispatch(setErrorSnackbar(retFetchGame));
        return navigate('/game');
      }
      if (
        retFetchGame.player1.id != userData.id &&
        retFetchGame.player2.id != userData.id
      ) {
        setIsSpectator(true);
        return dispatch(
          setPersonalizedErrorSnackbar('You are not in this game'),
        );
      }
      setIsPlayer1(retFetchGame.player1.id == userData.id);
      setCurrentPage('privateLobby');
    };
    fetchGame();
  }, [socket, userData.id, dispatch, navigate, gameIdInvit]);

  useEffect(() => {
    let timeoutId: any;
    if (connectStatus === 'disconnected') {
      timeoutId = setTimeout(() => setShowOverlay(true), 1000); // 1s delay
    } else {
      setShowOverlay(false);
    }
    return () => clearTimeout(timeoutId);
  }, [connectStatus]);

  useEffect(() => {
    if (!socket.emit) return;
    if (currentPage === 'lobby') {
      socket.emit('joinLobbyRoom');
    } else {
      socket.emit('leaveLobbyRoom');
    }
    socket.on('lobbyRoomUpdate', data => {
      setLobbyData(data);
    });

    return () => {
      socket.off('lobbyRoomUpdate');
    };
  }, [currentPage, socket]);

  useEffect(() => {
    const newSocket = io('/game', {
      withCredentials: true,
    });
    newSocket.on('connect', () => {
      setConnectStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectStatus('disconnected');
    });

    newSocket.on('userGameStatus', message => {
      if (message === 'foundNormal') {
        setBonus(false);
        setCurrentPage('game');
      } else if (message === 'foundBonus') {
        setBonus(true);
        setCurrentPage('game');
      } else if (message === 'alreadyInGame') {
        setCurrentPage('game');
      }
      if (message === 'notInGame') {
        setCurrentPage('lobby');
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('userGameStatus');
      newSocket.disconnect();
      setSocket({} as Socket);
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'lobby' && !gameIdInvit) {
      dispatch(desactivateEffect());
    } else if (currentPage === 'privateLobby') {
      dispatch(desactivateEffect());
    } else if (currentPage === 'searchOpponent' && !bonus) {
      dispatch(desactivateEffect());
    } else if (currentPage === 'searchOpponent' && bonus) {
      dispatch(activateEffect('red'));
    } else if (currentPage === 'game') {
      dispatch(activateEffect('black'));
    } else if (currentPage === 'spectate') {
      dispatch(activateEffect('black'));
    }
  }, [currentPage, gameIdInvit, dispatch]);

  let statusComponent;
  if (connectStatus === 'connecting') {
    statusComponent = <p>Connecting...</p>;
  } else {
    statusComponent = undefined;
  }

  useEffect(() => {
    if (!socket.emit) return;
    if (currentPage === 'lobby' && !gameIdInvit) {
      setPageContent(
        <Lobby
          setCurrentPage={setCurrentPage}
          socket={socket}
          setBonus={setBonus}
          lobbyData={lobbyData}
          setGameIdSpectate={setGameIdSpectate}
        />,
      );
    } else if (currentPage === 'game') {
      setPageContent(
        <Game
          socket={socket}
          lastGameInfo={lastGameInfo}
          setCurrentPage={setCurrentPage}
          bonus={bonus}
          isChatOpen={chatOpen}
        />,
      );
    } else if (currentPage === 'searchOpponent') {
      setPageContent(
        <SearchingOpponent
          socket={socket}
          setCurrentPage={setCurrentPage}
          bonus={bonus}
        />,
      );
    } else if (currentPage === 'privateLobby' && gameIdInvit) {
      setPageContent(
        <PrivateLobby
          socket={socket}
          gameId={gameIdInvit as string}
          isPlayer1={isPlayer1}
        />,
      );
    } else if (currentPage === 'spectate' && gameIdInvitSpectate) {
      setPageContent(
        <GameSpectator
          setCurrentPage={setCurrentPage}
          socket={socket}
          gameIdInvit={gameIdInvitSpectate}
        />,
      );
    } else {
      // console.warn('current page not found', currentPage);
    }
  }, [
    bonus,
    chatOpen,
    currentPage,
    gameIdInvit,
    gameIdInvitSpectate,
    isPlayer1,
    lobbyData,
    socket,
  ]);

  return (
    <div className="flex h-screen min-h-md relative w-full overflow-hidden">
      {cameFromLogin && <TransitionCircle expand={false} />}
      <GameWrapper chatOpen={chatOpen}>
        {showOverlay && <Overlay />}
        {statusComponent}
        {pageContent}
      </GameWrapper>

      <div
        onClick={toggleChat}
        title={chatOpen ? 'Close chat' : 'Open chat'}
        className="border-l-[1px] border-blue-800"
      >
        <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer hover:bg-blue-600">
          <IconButton
            size="small"
            aria-label="close"
            color="warning"
            sx={{ p: 0, m: 0 }}
          >
            {chatOpen ? (
              <KeyboardArrowRightIcon fontSize="small" sx={{ p: 0, m: 0 }} />
            ) : (
              <KeyboardArrowLeftIcon fontSize="small" sx={{ p: 0, m: 0 }} />
            )}
          </IconButton>
          <div style={{ width: '20px' }}>
            <p
              style={{
                textTransform: 'uppercase',
                transform: 'rotate(90deg)',
                transformOrigin: 'left bottom',
                marginBottom: '90px',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                color: '#fff',
              }}
            >
              {chatOpen ? 'Close chat' : 'Open chat'}
            </p>
          </div>
          <IconButton
            size="small"
            aria-label="close"
            color="warning"
            sx={{ p: 0, m: 0 }}
          >
            {chatOpen ? (
              <KeyboardArrowRightIcon fontSize="small" sx={{ p: 0, m: 0 }} />
            ) : (
              <KeyboardArrowLeftIcon fontSize="small" sx={{ p: 0, m: 0 }} />
            )}
          </IconButton>
        </div>
      </div>

      <div
        className={`${chatOpen ? 'w-1/4 max-w-[300px]' : 'hidden'} text-white`}
      >
        <ChatWrapper
          socket={socket}
          isSpectator={isSpectator}
          gameIdSpectator={gameIdInvitSpectate?.toString()}
          currentPage={currentPage}
          setChatOpen={setChatOpen}
        />
      </div>
    </div>
  );
}

export default Pong;
