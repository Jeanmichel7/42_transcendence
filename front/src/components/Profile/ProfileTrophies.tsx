import { Link } from 'react-router-dom';
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
      <div className="flex flex-wrap justify-center">
        {user.trophies?.map((trophy) => {
          trophy.isHeld = true;
          return <TrophyCard key={trophy.id} trophy={trophy} />;
        })}
      </div>
      <p className='text-center text-blue-600 '>
        <Link to={`/achievement/${user.login}`} >See all achievements</Link>
      </p>
    </>
  );
}
