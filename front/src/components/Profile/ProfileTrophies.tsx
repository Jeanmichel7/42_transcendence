import { UserInterface } from '../../types';
import { Sticker } from '../../utils/StyledTitle';
import { Nothing } from '../Friends/Nothing';
import { TrophyCard } from './TrophyCard';

export default function ProfileTrophies({ user }: { user: UserInterface }) {
  return (
    <>
      <p className='mt-6'>
        <Sticker dataText={'Achievements'} />
      </p>
      {user.trophies?.length === 0 && (
        <Nothing text={'No Trophy won'} angry={false} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 justify-center">
        {user.trophies?.map((trophy, index) => (
          <TrophyCard key={index} trophy={trophy} />
        ))}
      </div>
    </>
  );
}
