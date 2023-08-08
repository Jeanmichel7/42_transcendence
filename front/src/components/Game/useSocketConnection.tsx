import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./Interface";
import { GROUND_MAX_SIZE } from "./Game";
import { GameData } from "./Interface";
import { BonusPosition } from "./Interface";

const useSocketConnection = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  keyStateRef: RefObject<{
    ArrowUp: boolean;
    ArrowDown: boolean;
    " ": boolean;
  }>,
  posRacket: RefObject<{ left: number; right: number }>,
  gameId: MutableRefObject<number>,
  scorePlayers: RefObject<{ left: number; right: number }>,
  bonusPositionRef: MutableRefObject<BonusPosition | null>,
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  bonusIsLoading: MutableRefObject<boolean>,
  bonusValueRef: MutableRefObject<number | null>,
  racketHeightRef: RefObject<{ left: number; right: number }>,
  laser: RefObject<{ left: boolean; right: boolean }>
) => {
  const data = useRef<GameData | undefined>();

  function normalizeGameData(serverData: GameData) {
    data.current = serverData;
    if (data.current!.isPlayerRight === true) {
      data.current!.ball.x = GROUND_MAX_SIZE - serverData.ball.x;
      data.current!.ball.vx = -serverData.ball.vx;
      posRacket.current!.right = serverData.racketLeft;
      scorePlayers.current!.right = serverData.player1Score;
      scorePlayers.current!.left = serverData.player2Score;
      racketHeightRef.current!.left = serverData.racketRightHeight;
      racketHeightRef.current!.right = serverData.racketLeftHeight;
      if (serverData.bonus) {
        bonusPositionRef.current = serverData.bonus;
        bonusPositionRef.current.x = GROUND_MAX_SIZE - serverData.bonus.x;
      }
      bonusIsLoading.current = serverData.bonusPlayer2Loading;
      bonusValueRef.current = serverData.bonusPlayer2;
      laser.current!.left = serverData.player2Laser;
      laser.current!.right = serverData.player1Laser;
    } else {
      racketHeightRef.current!.left = serverData.racketLeftHeight;
      racketHeightRef.current!.right = serverData.racketRightHeight;
      scorePlayers.current!.right = serverData.player2Score;
      scorePlayers.current!.left = serverData.player1Score;
      posRacket.current!.right = serverData.racketRight;
      bonusPositionRef.current = serverData.bonus;
      bonusIsLoading.current = serverData.bonusPlayer1Loading;
      bonusValueRef.current = serverData.bonusPlayer1;
      laser.current!.right = serverData.player2Laser;
      laser.current!.left = serverData.player1Laser;
    }
    gameId.current = serverData.gameId;
    return data.current;
  }

  useEffect(() => {
    if (!socket) return;
    const intervalId: number = setInterval(() => {
      socket.emit("clientUpdate", {
        posRacket: posRacket.current!.left,
        ArrowDown: keyStateRef.current!.ArrowDown,
        ArrowUp: keyStateRef.current!.ArrowUp,
        gameId: gameId.current!,
        useBonus: keyStateRef.current![" "],
      });
    }, 1000 / 60);

    socket.on("gameUpdate", (serverData: GameData) => {
      data.current = normalizeGameData(serverData);
      if (data.current?.gameStart) {
        setGameStarted(true);
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      socket.off("gameUpdate");
    };
  }, []);

  return { gameData: data, gameId };
};

export default useSocketConnection;
