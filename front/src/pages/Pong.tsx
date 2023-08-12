import Game from '../components/Game/Game';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import EndGame from '../components/Game/EndGame';
import { Socket, io } from 'socket.io-client';
import Lobby from '../components/Game/Lobby';
import SearchingOpponent from '../components/Game/SearchingOpponent';
import { Overlay } from '../components/Game/Overlay';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiErrorResponse, GameInterface } from '../types';
import { getGame } from '../api/game';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setPersonalizedErrorSnackbar } from '../store/snackbarSlice';
import { RootState } from '../store';
import PrivateLobby from '../components/Game/PrivateLobby';
import { activateEffect, desactivateEffect } from '../store/gameSlice';

export const GameWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

function Pong() {
  const [socket, setSocket] = useState<Socket>({} as Socket);
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
  const [showOverlay, setShowOverlay] = useState(false);

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
        return dispatch(setPersonalizedErrorSnackbar('You are not in this game'));
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
    const newSocket = io('http://localhost:3000/game', {
      withCredentials: true,
    });
    newSocket.on('connect', () => {
      setConnectStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectStatus('disconnected');
      console.log('ERROR SOCKET DISCONNECTED');
    });

    newSocket.on('userGameStatus', (message) => {
      if (message === 'foundNormal') {
        dispatch(activateEffect());
        setBonus(false);
        setCurrentPage('game');
      }
      if (message === 'foundBonus') {
        dispatch(activateEffect());
        setBonus(true);
        setCurrentPage('game');
      }
      if (message === 'alreadyInGame') {
        console.log('bonus value', bonus);
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
    // dispatch(desactivateEffect());
    pageContent = (
      <Lobby
        setCurrentPage={setCurrentPage}
        socket={socket}
        setBonus={setBonus}
      />
    );
  } else if (currentPage === 'game') {
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
  } else if (currentPage === 'privateLobby') {
    // dispatch(desactivateEffect());
    pageContent = (
      <PrivateLobby
        setCurrentPage={setCurrentPage}
        socket={socket}
        gameId={gameId as string}
        isPlayer1={isPlayer1}
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
