import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  GameData,
  ServerToClientEvents,
} from './Interface';
import './font.css';
import useSocketConnectionSpectator from './useSocketConnectionSpectator';
import { Ball, Bonus, GameWrapper, Laser, Playground, Racket } from './Game';
import { StatutBar } from './StatutBar';
import { StyledButton } from './EndGame';

function GameSpectator({
  socket,
  setCurrentPage,
  gameId,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  setCurrentPage: Dispatch<SetStateAction<string>>;
  gameId: bigint;
}) {
  const gameDimensions = useRef({ width: 0, height: 0 });
  const { gameData }: { gameData: GameData | undefined } =
    useSocketConnectionSpectator(socket, gameId);
  if (gameData?.winner) {
    setCurrentPage('lobby');
  }

  useEffect(() => {
    const handleResize = () => {
      const gameWrapper = document.querySelector('#playground') as HTMLElement;
      if (gameWrapper) {
        gameDimensions.current.width = gameWrapper.offsetWidth;
        gameDimensions.current.height = gameWrapper.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  console.log(gameData);

  return (
    <GameWrapper>
      {gameData && (
        <>
          <StatutBar
            playersInfo={{
              playerLeftUsername: gameData.player1Username,
              playerRightUsername: gameData.player2Username,
              playerLeftAvatar: gameData.player1Avatar,
              playerRightAvatar: gameData.player2Avatar,
            }}
            scorePlayerLeft={gameData.player1Score}
            scorePlayerRight={gameData.player2Score}
            bonusActive={gameData.bonusMode}
            bonusIsLoading={gameData.bonusPlayer1Loading}
            bonusName={gameData.bonusPlayer1}
            spectateMode={true}
            bonusIsLoadingPlayerRight={gameData.bonusPlayer2Loading}
            bonusNamePlayerRight={gameData.bonusPlayer2}
            //... passez les autres props ici
          />
          <Playground id="playground">
            <Racket
              posY={gameData.racketLeft}
              height={gameData.racketLeftHeight}
              type={'left'}
            >
              {gameData.player1Laser && <Laser type={'left'} />}
            </Racket>
            <Ball
              posX={gameData.ball.x * (gameDimensions.current.width / 1000)}
              posY={gameData.ball.y * (gameDimensions.current.height / 1000)}
            />
            {gameData.bonusMode && (
              <Bonus
                bonus={gameData.bonus}
                posX={
                  gameData.bonus?.x
                    ? gameData.bonus.x * (gameDimensions.current.width / 1000)
                    : -1
                }
                posY={
                  gameData.bonus?.y
                    ? gameData.bonus.y * (gameDimensions.current.height / 1000)
                    : -1
                }
              />
            )}
            <Racket
              posY={gameData.racketRight}
              height={gameData.racketRightHeight}
              type={'right'}
            >
              {gameData.player2Laser && <Laser type={'right'} />}
            </Racket>
            <div className="absolute left-1/2 -translate-y-2/4	 -translate-x-2/4	  bottom-0 mx-auto">
              <StyledButton onClick={() => setCurrentPage('lobby')}>
                Return to Lobby
              </StyledButton>
            </div>
          </Playground>
        </>
      )}
    </GameWrapper>
  );
}

export default GameSpectator;
