import Game from '../components/Game/Game';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import EndGame from '../components/Game/EndGame';
import { Socket, io } from 'socket.io-client';
import Lobby from '../components/Game/Lobby';
import SearchingOpponent from '../components/Game/SearchingOpponent';
import { Overlay } from '../components/Game/Overlay';
import '../components/Game/font.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiErrorResponse, GameInterface } from '../types';
import { getGame } from '../api/game';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';
import { RootState } from '../store';

export const GameWrapper = styled.div`
  width: 80vw;
  height: 50vh;
  background-color: black;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  font-family: "neontubes";
  overflow: hidden;
`;

function Pong() {
  const [socket, setSocket] = useState<Socket>({} as Socket);
  // const socketRef = useRef<Socket | null>(null);
  const [connectStatus, setConnectStatus] = useState('disconnected');
  const [currentPage, setCurrentPage] = useState<string>('lobby');
  const { userData } = useSelector((state: RootState) => state.user);
  const lastGameInfo = useRef({} as any);
  const [bonus, setBonus] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameId = searchParams.get('id');

  useEffect(() => {
    if (!gameId || !userData.id || userData.id == -1) return;
    console.log('gameId', gameId);

    const fetchGame = async () => {
      const retFetchGame: GameInterface | ApiErrorResponse = await getGame(parseInt(gameId));
      console.log('retFetchGame', retFetchGame);
      if ('error' in retFetchGame) {
        dispatch(setErrorSnackbar(retFetchGame.error + retFetchGame.message ? ': ' + retFetchGame.message : ''));
        return navigate('/game');
      }
      if (retFetchGame.player1.id != userData.id && retFetchGame.player2.id != userData.id)
        return dispatch(setErrorSnackbar('You are not in this game'));
    };
    fetchGame();
  }, [gameId, userData.id, dispatch, navigate]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/game', {
      withCredentials: true,
    });
    newSocket.on('connect', () => {
      setConnectStatus('connected');
      console.log('connected');
    });
    
    newSocket.on('disconnect', () => {
      setConnectStatus('disconnected');
      console.log('ERROR SOCKET DISCONNECTED');
    });

    newSocket.on('userGameStatus', (message) => {
      console.log('Pong status update', message);
      if (message === 'foundNormal') {
        setCurrentPage('game');
        setBonus(false);
      }
      if (message === 'foundBonus') {
        setCurrentPage('game');
        setBonus(true);
      }
      if (message === 'alreadyInGame') {
        setCurrentPage('game');
      }
      if (message === 'notInGame') {
        setCurrentPage('lobby');
      }
    });
    
    setSocket(newSocket);
    console.log('socket', socket);

    return () => {
      newSocket.disconnect();
      setSocket({} as Socket);
    };
  }, []);

  let statusComponent;
  if (connectStatus === 'connecting') {
    statusComponent = <p>Connecting...</p>;
  } else {
    statusComponent = undefined;
  }
  let pageContent;
  if (currentPage === 'lobby') {
    pageContent = <Lobby setCurrentPage={setCurrentPage} socket={socket} />;
  } else if (currentPage === 'finished') {
    pageContent = (
      <EndGame setCurrentPage={setCurrentPage} lastGameInfo={lastGameInfo} />
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
      <SearchingOpponent socket={socket} setCurrentPage={setCurrentPage} />
    );
  }
  return (
    <GameWrapper>
      {connectStatus === 'disconnected' && <Overlay />}
      {statusComponent}
      {pageContent}
    </GameWrapper>
  );
}

export default Pong;
