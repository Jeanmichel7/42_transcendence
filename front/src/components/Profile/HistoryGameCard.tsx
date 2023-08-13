import { useState, useEffect } from 'react';
import { GameInterface, UserInterface } from '../../types';

interface GameCardProps {
  game: GameInterface;
  user: UserInterface;
}

const GameCard = ({ game, user }: GameCardProps) => {
  const [duration, setDuration] = useState<string>('');
  const [p1IsWinner, setP1IsWinner] = useState<boolean>(false);

  useEffect(() => {
    setP1IsWinner(game.player1.id === game.winner?.id);
  }, [game, user.id]);

  const calculDuration = (dateStart: Date, dateEnd: Date) => {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const diff = Math.abs(end.getTime() - start.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return minutes ? minutes + 'min ' : '' + seconds + 's';
  };

  useEffect(() => {
    if (game.status === 'finished') {
      setDuration(calculDuration(game.createdAt, game.finishAt as Date));
    }
  }, [game]);

  return (
    <div className="flex justify-center items-center w-full bg-blue-100 border-b-2 border-blue-200 ">
      <div className="p-2 text-center">
        <img
          className="w-12 h-12 rounded-full object-cover border border-[#5f616f]"
          src={p1IsWinner ? game.player1.avatar : game.player2.avatar}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
          }}
          alt="avatar"
        />
      </div>

      <div className="p-2 min-w-[25vw]">
        <p className="font-bold">
          {p1IsWinner ? game.player1.login : game.player2.login}
        </p>
        <p> Win </p>
      </div>

      <div className="flex-grow text-center">
        <p className="text-[1.3rem] font-bold">
          {p1IsWinner ? game.scorePlayer1 : game.scorePlayer2}
          {' - '}
          {!p1IsWinner ? game.scorePlayer1 : game.scorePlayer2}
        </p>
        <p> Duration: {duration} </p>
      </div>

      <div className="p-2 min-w-[25vw]">
        <p className="font-bold text-end">
          {!p1IsWinner ? game.player1.login : game.player2.login}
        </p>
        <p className="text-end"> Lose </p>
      </div>

      <div className="p-2">
        <img
          className="w-12 h-12 rounded-full object-cover border border-[#5f616f]"
          src={!p1IsWinner ? game.player1.avatar : game.player2.avatar}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
          }}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default GameCard;
