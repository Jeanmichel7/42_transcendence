import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import Score from './Score';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  GameData,
  ServerToClientEvents,
} from './Interface';
import BonusBox from './BonusBox';
import './font.css';
import useSocketConnectionSpectator from './useSocketConnectionSpectator';
import { Ball, Bonus, GameWrapper, Laser, Playground, Racket } from './Game';

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
  const { gameData }: { gameData: GameData } = useSocketConnectionSpectator(
    socket,
    gameId
  );

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

  return (
    <GameWrapper>
      {gameData && (
        <>
          <Score
            scorePlayerLeft={gameData.player1Score}
            scorePlayerRight={gameData.player2Score}
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
          </Playground>
          {gameData.bonusMode && (
            <BonusBox
              bonusIsLoading={gameData.bonusPlayer1Loading}
              bonusName={gameData.bonusPlayer1}
            />
          )}
        </>
      )}
    </GameWrapper>
  );
}

export default GameSpectator;
