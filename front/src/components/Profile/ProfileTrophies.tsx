import { UserInterface } from '../../types';
import { Sticker } from '../../utils/StyledTitle';
import { Nothing } from '../Friends/Nothing';
import { TrophyCard } from './TrophyCard';
import { ranksImages } from '../../utils/rankImages';

export default function ProfileTrophies({ user }: { user: UserInterface }) {
  return (
    <>
      <div className="flex flex-row justify-around">
        <img
          src={ranksImages[user.rank]}
          alt="rank"
          className="w-40 h-40 ml-5"
          title={user.rank}
        />
        <Sticker dataText={'Trophies'} />
        <img
          src={ranksImages[user.rank]}
          alt="rank"
          className="w-40 h-40 mr-5 "
          title={user.rank}
        />
      </div>
      {user.trophies?.length === 0 && (
        <Nothing text={'No Trophy won'} angry={false} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
        {user.trophies?.map((trophy, index) => (
          <TrophyCard key={index} trophy={trophy} />
        ))}
      </div>
    </>
  );
}
