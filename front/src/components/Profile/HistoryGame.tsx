import { UserInterface } from '../../types';
import { GameInterface } from '../../types/GameTypes';
import { Sticker } from '../../utils/StyledTitle';
import GameCard from './HistoryGameCard';

interface PropsGames {
  user: UserInterface;
  games: GameInterface[];
}

export default function HistoryGame({ user, games }: PropsGames) {
  return (
    <>
      <p className="mt-6">
        <Sticker dataText="Games" />
      </p>
      {games &&
        games.length > 0 &&
        games.map(game => <GameCard game={game} user={user} key={game.id} />)}
    </>
  );
}
