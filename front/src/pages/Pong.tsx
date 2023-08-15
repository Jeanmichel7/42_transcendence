import Game from '../components/Game/Game';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Socket, io } from 'socket.io-client';
import Lobby from '../components/Game/Lobby';
import SearchingOpponent from '../components/Game/SearchingOpponent';
import { Overlay } from '../components/Game/Overlay';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export const GameWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

export interface GameCard {
  id: bigint;
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
  // const socketRef = useRef<Socket | null>(null);
  const [connectStatus, setConnectStatus] = useState('disconnected');
  const [currentPage, setCurrentPage] = useState<string>('lobby');
  const { userData } = useSelector((state: RootState) => state.user);
  const lastGameInfo = useRef({} as any);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [bonus, setBonus] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameId = searchParams.get('id');
  const [gameIdSpectate, setGameIdSpectate] = useState<undefined | bigint>();
  const [showOverlay, setShowOverlay] = useState(false);
  const [lobbyData, setLobbyData] = useState<GameCard[]>([]);

  useEffect(() => {
    if (!gameId || !userData.id || userData.id == -1) return;

    const fetchGame = async () => {
      const retFetchGame: GameInterface | ApiErrorResponse = await getGame(
        parseInt(gameId),
      );
      if ('error' in retFetchGame) {
        dispatch(setErrorSnackbar(retFetchGame));
        return navigate('/game');
      }
      if (
        retFetchGame.player1.id != userData.id &&
        retFetchGame.player2.id != userData.id
      )
        return dispatch(
          setPersonalizedErrorSnackbar('You are not in this game'),
        );
      console.log('retFetchGame : ', retFetchGame);

      setIsPlayer1(retFetchGame.player1.id == userData.id);
      setCurrentPage('privateLobby');
    };
    fetchGame();
  }, [socket, userData.id, dispatch, navigate]);

  useEffect(() => {
    let timeoutId: any;
    if (connectStatus === 'disconnected') {
      timeoutId = setTimeout(() => setShowOverlay(true), 1000); // 1s delay
    } else {
      setShowOverlay(false);
    }

    // Cleanup function to clear the timeout when component unmounts or re-renders
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
      // N'oubliez pas de nettoyer l'écouteur pour éviter des écouteurs multiples
      socket.off('lobbyRoomUpdate');
    };
  }, [currentPage, socket]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/game', {
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
    if (currentPage === 'lobby' && !gameId) {
      dispatch(desactivateEffect());
    } else if (currentPage === 'privateLobby') {
      dispatch(desactivateEffect());
    }
  }, [currentPage, gameId, dispatch]);

  let statusComponent;
  if (connectStatus === 'connecting') {
    statusComponent = <p>Connecting...</p>;
  } else {
    statusComponent = undefined;
  }
  let pageContent: ReactNode;
  if (currentPage === 'lobby' && !gameId) {
    dispatch(desactivateEffect());
    pageContent = (
      <Lobby
        setCurrentPage={setCurrentPage}
        socket={socket}
        setBonus={setBonus}
        lobbyData={lobbyData}
        setGameIdSpectate={setGameIdSpectate}
      />
    );
  } else if (currentPage === 'game') {
    dispatch(activateEffect());
    pageContent = (
      <Game
        socket={socket}
        lastGameInfo={lastGameInfo}
        setCurrentPage={setCurrentPage}
        bonus={bonus}
      />
    );
  } else if (currentPage === 'searchOpponent') {
    pageContent = (
      <SearchingOpponent
        socket={socket}
        setCurrentPage={setCurrentPage}
        bonus={bonus}
      />
    );
  } else if (currentPage === 'privateLobby' && gameId) {
    dispatch(desactivateEffect());
    pageContent = (
      <PrivateLobby
        setCurrentPage={setCurrentPage}
        socket={socket}
        gameId={gameId as string}
        isPlayer1={isPlayer1}
      />
    );
  } else if (currentPage === 'spectate' && gameIdSpectate) {
    dispatch(activateEffect());
    console.log('spectate', gameIdSpectate);
    pageContent = (
      <GameSpectator
        setCurrentPage={setCurrentPage}
        socket={socket}
        gameId={gameIdSpectate}
      />
    );
  }

  return (
    <GameWrapper>
      {showOverlay && <Overlay />}
      {statusComponent}
      {pageContent}
    </GameWrapper>
  );
}

export default Pong;
